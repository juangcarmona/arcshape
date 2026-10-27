import { access, readFile } from "node:fs/promises";
import { isAbsolute, resolve, sep } from "node:path";
import { marked } from "marked";
import GithubSlugger from "github-slugger";

export async function validateMarkdownLinks(
  documents,
  repositoryRoot,
  docsDir,
) {
  const problems = [];
  for (const document of documents) {
    const source = resolve(docsDir, document.file);
    const tokens = marked.lexer(document.body);
    const links = [];
    marked.walkTokens(tokens, (token) => {
      if (token.type === "link" || token.type === "image")
        links.push(token.href);
    });
    for (const href of links) {
      if (!href || href.startsWith("#")) continue;
      let target;
      try {
        target = new URL(href, "https://arcshape.invalid");
      } catch {
        problems.push(`${document.file}: invalid link destination ${href}`);
        continue;
      }
      if (target.origin !== "https://arcshape.invalid") continue;
      let pathname;
      try {
        pathname = decodeURIComponent(href.split(/[?#]/, 1)[0]);
      } catch {
        problems.push(`${document.file}: invalid URL encoding in ${href}`);
        continue;
      }
      const resolvedTarget = pathname.startsWith("/")
        ? resolve(repositoryRoot, pathname.slice(1))
        : resolve(source, "..", pathname);
      const relativePath = relativeFromRoot(repositoryRoot, resolvedTarget);
      if (
        isAbsolute(relativePath) ||
        relativePath === ".." ||
        relativePath.startsWith(`..${sep}`)
      ) {
        problems.push(`${document.file}: link escapes the repository: ${href}`);
        continue;
      }
      if (!target.hash || !pathname.toLowerCase().endsWith(".md")) {
        try {
          await access(resolvedTarget);
        } catch {
          problems.push(`${document.file}: missing local target ${href}`);
        }
        continue;
      }
      let fragment;
      try {
        fragment = decodeURIComponent(target.hash.slice(1));
      } catch {
        problems.push(
          `${document.file}: invalid heading URL encoding in ${href}`,
        );
        continue;
      }
      try {
        const targetContents = await readFile(resolvedTarget, "utf8");
        const slugger = new GithubSlugger();
        let found = false;
        marked.walkTokens(marked.lexer(targetContents), (candidate) => {
          if (
            candidate.type === "heading" &&
            slugger.slug(candidate.text) === fragment
          )
            found = true;
        });
        if (!found)
          problems.push(
            `${document.file}: missing heading #${fragment} in ${href}`,
          );
      } catch {
        problems.push(
          `${document.file}: cannot read local Markdown target ${href}`,
        );
      }
    }
  }
  return problems;
}

function relativeFromRoot(root, path) {
  const normalizedRoot = resolve(root);
  const normalizedPath = resolve(path);
  return normalizedPath.startsWith(`${normalizedRoot}${sep}`)
    ? normalizedPath.slice(normalizedRoot.length + 1)
    : normalizedPath === normalizedRoot
      ? ""
      : normalizedPath;
}
