import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

it("publishes the engineering diagram gallery in English", async () => {
  const gallery = await readFile(
    new URL(
      "../docs/architecture/08-crosscutting-concepts/diagram-gallery.md",
      import.meta.url,
    ),
    "utf8",
  );
  const diagrams = [...gallery.matchAll(/```archify\n([\s\S]*?)\n```/g)].map(
    ([, source]) => JSON.parse(source),
  );
  expect(diagrams).toHaveLength(10);
  expect(diagrams.every((diagram) => diagram.meta.locale === "en")).toBe(true);
});
