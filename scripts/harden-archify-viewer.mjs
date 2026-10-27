// Mechanical tailoring for the pinned template, not a general JavaScript transform.
// Use Map/Set for URL-derived keys; keep exported depth snapshots as plain data.
export function hardenViewer(source) {
  for (const name of [
    "seenNodeIds",
    "nodeIdSet",
    "selected",
    "related",
    "seeds",
    "wanted",
    "reached",
    "chosen",
    "depths",
    "distances",
    "previous",
  ]) {
    const set = !["depths", "distances", "previous"].includes(name);
    const declaration = new RegExp(
      `var ${name} = (?:Object\\.create\\(null\\)|\\{\\});`,
      "g",
    );
    if (!declaration.test(source))
      throw new Error(`Missing pinned dictionary: ${name}`);
    source = source.replace(
      declaration,
      `var ${name} = new ${set ? "Set" : "Map"}();`,
    );
    source = source.replace(
      new RegExp(`Object\\.keys\\(${name}\\)`, "g"),
      `Array.from(${name}.keys())`,
    );
    source = source.replace(
      new RegExp(
        `Object\\.prototype\\.hasOwnProperty\\.call\\(${name}, ([^)]+)\\)`,
        "g",
      ),
      `${name}.has($1)`,
    );
    const access = new RegExp(`(?<![\\w.])${name}\\[`);
    function rewrite(text) {
      let match;
      while ((match = access.exec(text))) {
        const start = match.index;
        let end = start + match[0].length,
          depth = 1;
        const keyStart = end;
        for (; end < text.length && depth; end++) {
          if (text[end] === "[") depth++;
          if (text[end] === "]") depth--;
        }
        if (depth) throw new Error("Unbalanced pinned dictionary access");
        const key = text.slice(keyStart, end - 1);
        const assignment = /^\s*=\s*(?!=)/.exec(text.slice(end));
        let replacement;
        if (assignment) {
          const valueStart = end + assignment[0].length;
          const valueEnd = text.indexOf(";", valueStart);
          if (valueEnd < 0)
            throw new Error("Missing pinned assignment delimiter");
          const value = rewrite(text.slice(valueStart, valueEnd));
          if (set && value !== "true")
            throw new Error("Unexpected pinned set value");
          replacement = set
            ? `${name}.add(${key})`
            : `${name}.set(${key}, ${value})`;
          end = valueEnd;
        } else replacement = `${name}.${set ? "has" : "get"}(${key})`;
        text = text.slice(0, start) + replacement + text.slice(end);
      }
      return text;
    }
    source = rewrite(source);
  }
  return source.replaceAll(
    "depths: depths,",
    "depths: Object.fromEntries(depths),",
  );
}
