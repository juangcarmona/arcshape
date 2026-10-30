import { Marked } from "marked";
import { nativeReferences } from "./native-previews.mjs";
import { convertMermaid } from "./mermaid-native.mjs";

export async function prepareDiagrams(document, docsDir, deepDiveMode) {
  let body = document.body;
  const origins = new Map();
  const references = await nativeReferences(body, {
    docsDir,
    document: document.file,
  });
  for (const reference of references) {
    origins.set(reference.source.trimEnd(), { reference });
    body = body.replace(
      reference.raw,
      () => `\n\n\`\`\`archify\n${reference.source.trimEnd()}\n\`\`\`\n\n`,
    );
  }
  if (deepDiveMode === "off") return { body, origins };
  const marked = new Marked({ gfm: true });
  const tokens = marked.lexer(body);
  // Nested Markdown remains Mermaid; replace only actual top-level fence tokens.
  const blocks = tokens.filter(
    (token) =>
      token.type === "code" && String(token.lang).split(/\s/)[0] === "mermaid",
  );
  for (const [index, token] of blocks.entries()) {
    const location = `${document.file}: Mermaid diagram ${index + 1}`;
    const result = await convertMermaid(token.text, { location });
    if (result.status === "unsupported") {
      process.stderr.write(
        `${location}: retaining Mermaid (${result.reason})\n`,
      );
      continue;
    }
    origins.set(result.source.trimEnd(), { mermaid: token.text });
    token.raw = `\n\n\`\`\`archify\n${result.source.trimEnd()}\n\`\`\`\n\n`;
  }
  return { body: tokens.map((token) => token.raw).join(""), origins };
}
