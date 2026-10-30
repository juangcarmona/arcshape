import { describe, it, expect } from "vitest";
import { convertMermaid } from "../packages/cli/src/arc42-site/mermaid-native.mjs";

const flow = (direction = "LR") =>
  `flowchart ${direction}\naccTitle: Reservation flow\nA[Request] -->|yes| B{Available}\nB --> A`;

describe("Mermaid-native semantic conversion", () => {
  it("preserves simple sequence participants, aliases and message order", async () => {
    const { status, source } = await convertMermaid(
      "sequenceDiagram\naccTitle: Request and reply\nparticipant A as Client\nparticipant B as Service\nA->>B: Request\nB-->>A: Reply",
    );
    expect(status).toBe("converted");
    const data = JSON.parse(source);
    expect(data.diagram_type).toBe("sequence");
    expect(data.participants.map(({ id, label }) => [id, label])).toEqual([
      ["A", "Client"],
      ["B", "Service"],
    ]);
    expect(data.messages).toMatchObject([
      { from: "A", to: "B", label: "Request", y: 170 },
      { from: "B", to: "A", label: "Reply", y: 240, variant: "return" },
    ]);
  });
  it.each([
    "A->>A: Self call",
    "A-)B: Async",
    "Note over A,B: Details",
    "A->>+B: Activate\nB-->>-A: Return",
    "autonumber\nA->>B: Numbered",
    "loop Retry\nA->>B: Request\nend",
    "actor C\nC->>B: Request",
    "box Boundary\nparticipant C\nend\nA->>B: Request",
  ])("retains unsupported sequence semantics: %s", async (body) => {
    expect(
      await convertMermaid(
        `sequenceDiagram\naccTitle: Unsupported\nparticipant A\nparticipant B\n${body}`,
      ),
    ).toMatchObject({ status: "unsupported", reason: expect.any(String) });
  });
  it("preserves identities, labels, directed cycles and decision meaning", async () => {
    const result = await convertMermaid(flow());
    expect(result.status).toBe("converted");
    const data = JSON.parse(result.source);
    expect(data.components.map((n) => n.id)).toEqual(["A", "B"]);
    expect(data.components[1]).toMatchObject({
      label: "Available",
      tag: "Decision",
    });
    expect(data.connections).toMatchObject([
      { id: "edge-0", from: "A", to: "B", label: "yes" },
      { id: "edge-1", from: "B", to: "A" },
    ]);
  });
  it.each(["LR", "RL", "TB", "TD", "BT"])(
    "preserves %s orientation",
    async (direction) => {
      const { source } = await convertMermaid(flow(direction));
      const [a, b] = JSON.parse(source).components;
      const axis = ["LR", "RL"].includes(direction) ? 0 : 1;
      expect(Math.sign(b.pos[axis] - a.pos[axis])).toBe(
        ["RL", "BT"].includes(direction) ? -1 : 1,
      );
    },
  );
  it("preserves nested boundary labels and descendant membership", async () => {
    const result = await convertMermaid(
      "flowchart LR\naccTitle: Containers\nsubgraph system[System]\nsubgraph internal[Internal]\nA[API] --> B[Worker]\nend\nend",
    );
    expect(result.status).toBe("converted");
    const boundaries = JSON.parse(result.source).boundaries;
    expect(boundaries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "System",
          wraps: expect.arrayContaining(["A", "B"]),
        }),
        expect.objectContaining({
          label: "Internal",
          wraps: expect.arrayContaining(["A", "B"]),
        }),
      ]),
    );
  });
  it.each([
    "sequenceDiagram\nparticipant A\nparticipant B\nalt Valid\nA->>B: Request\nend",
    "flowchart LR\nA[Request] --> B[Done]\nstyle A fill:red",
    "flowchart LR\nA((Circle)) --> B[Done]",
    "flowchart LR\nA[Request] --> A",
  ])(
    "leaves valid unsupported constructs wholly in Mermaid",
    async (source) => {
      expect(await convertMermaid(source)).toMatchObject({
        status: "unsupported",
        reason: expect.any(String),
      });
    },
  );
  it("reports invalid Mermaid with document location", async () => {
    await expect(
      convertMermaid("flowchart LR\nA[Broken", {
        location: "06-runtime/README.md: diagram 2",
      }),
    ).rejects.toThrow(/06-runtime\/README.md: diagram 2: invalid Mermaid/);
  });
  it("preserves standard quoted two-line labels as title and detail", async () => {
    const { source } = await convertMermaid(
      'flowchart LR\naccTitle: Context\nA["ArcShape CLI\nLocal commands"] --> B[Repository]',
    );
    expect(JSON.parse(source).components[0]).toMatchObject({
      label: "ArcShape CLI",
      sublabel: "Local commands",
    });
  });
  it("preserves quoted labels and dashed/thick directed relationships", async () => {
    const { source } = await convertMermaid(
      'flowchart LR\naccTitle: Relationships\nA["Price $&"] -.->|optional| B[Done]\nB ==> A',
    );
    const data = JSON.parse(source);
    expect(data.components[0].label).toBe("Price $&");
    expect(data.connections.map((e) => e.variant)).toEqual([
      "dashed",
      "emphasis",
    ]);
  });
});
