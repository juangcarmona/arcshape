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
  const deepDives = [];
  if (deepDiveMode === "off") return { body, origins, deepDives };
  const marked = new Marked({ gfm: true });
  const blocks = [];
  marked.walkTokens(marked.lexer(body), (token) => {
    if (
      token.type === "code" &&
      String(token.lang).split(/\s/)[0] === "mermaid"
    )
      blocks.push(token);
  });
  for (const [index, token] of blocks.entries()) {
    const location = `${document.file}: Mermaid diagram ${index + 1}`;
    const result = await convertMermaid(token.text, { location });
    if (result.status === "unsupported") {
      process.stderr.write(
        `${location}: no Archify deep dive (${result.reason})\n`,
      );
      continue;
    }
    deepDives.push({ index, mermaid: token.text, source: result.source });
  }
  return { body, origins, deepDives };
}
