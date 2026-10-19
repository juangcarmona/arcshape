# Issue #78 Mermaid verification

The architecture snapshot generated from source revision `cbdfd44031d1584d36d623cf50ec940b4130ebcc` contains four Mermaid diagrams in sections 03, 05, 06, and 07.

For each generated diagram, a Playwright browser inspection confirmed:

- Visible `Renderer: Mermaid` identity and the authored `accTitle` caption.
- A Markdown source link and a full source-revision commit link.
- An SVG `role="img"` with valid `aria-labelledby` title and `aria-describedby` description references.
- Text labels for renderer, title, source, and revision, so renderer identity is not conveyed by colour alone.
- Keyboard traversal reaches the first diagram provenance link with a visible focus outline.

The link/source rendering unit test is `tests/render-site-links.test.mjs`. The diagram itself remains build-time inline SVG; the authoring Markdown remains canonical.
