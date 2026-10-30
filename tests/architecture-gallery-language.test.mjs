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
  const references = [
    ...gallery.matchAll(/<!-- arcshape-diagram-source: (.+?) -->/g),
  ];
  const diagrams = await Promise.all(
    references.map(async ([, path]) =>
      JSON.parse(
        await readFile(
          new URL(
            "../docs/architecture/08-crosscutting-concepts/" + path,
            import.meta.url,
          ),
          "utf8",
        ),
      ),
    ),
  );
  expect(diagrams).toHaveLength(10);
  expect(diagrams.every((diagram) => diagram.meta.locale === "en")).toBe(true);
});
