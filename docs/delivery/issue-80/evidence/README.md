# Issue #80 review evidence

This bundle records the locally built Death Star architecture example and the automated browser evidence for [PR #81](https://github.com/juangcarmona/arcshape/pull/81).

## Revisions and license

- Source example: [`juangcarmona/starwars-deathstar-arc42-documentation`](https://github.com/juangcarmona/starwars-deathstar-arc42-documentation/tree/6a5576bda72de08a217ccdf94461c5eaeea9f8a5), revision `6a5576bda72de08a217ccdf94461c5eaeea9f8a5`.
- ArcShape implementation revision used to generate the current local screenshots: `d9c4113c3671181a6b60f25aa14d07872366f73e`.
- PR #81 was rebased onto #79 merge commit `fc0f7986a32eb285955adf24810297dfba5d583c`. The CodeQL conflict resolution keeps exclusions for both generated portal HTML and the example's generated Archify HTML.
- The adapted source material is licensed CC BY-NC 4.0. Attribution, a link to the license, and a modification notice are retained in both locale entry points. The example is fictional fan work and is not affiliated with or endorsed by Lucasfilm Ltd. or Disney. The non-commercial restriction must be considered before any later publication.

The adaptation keeps the overview and all twelve arc42 sections in English and Spanish, along with the referenced artwork. It corrects the runtime-sequence inconsistencies identified in the source and the Spanish overview's English image alternative text. No narrative section was intentionally dropped. The original content was adapted to ArcShape's README, numbered-file, and frontmatter contract.

## Acceptance evidence map

| Issue #80 acceptance criterion                                                                                          | Evidence                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| EN/ES example, all twelve sections, attribution, license, modification note, and disclaimer                             | `examples/starwars-deathstar/en/README.md`, `examples/starwars-deathstar/es/README.md`; reader builds and locale assertions in the E2E run below. |
| Reader contract, corrected scenario/sequence content, localized alternative text, and self-contained root/subpath links | The two locale source folders; Playwright root and `/arcshape/` coverage in the retained report and traces.                                       |
| Accessible Mermaid and Archify with renderer/source provenance                                                          | Mermaid source and built reader assertions; `examples/starwars-deathstar/diagrams/` manifest and HTML; Archify screenshot and E2E checks.         |
| Desktop and narrow examples plus review evidence                                                                        | The three screenshots in this folder, dimensions and observations below, and the linked Actions report/traces.                                    |
| Human judgement on clarity, visual appeal, Spanish adaptation, and test adequacy                                        | The maintainer approved both PRs and the example/test adequacy in this conversation; the screenshots and browser assertions are supporting evidence. |
| Isolated example without a public route or Cloudflare publication                                                       | Example remains under `examples/`; no public or engineering route was added. Publication was not tested.                                          |

## Captures

### English reader — desktop

![English Death Star architecture reader at desktop size](death-star-en-desktop.png)

- Browser viewport: **1440 × 900**.
- Route: English example at the root base path.
- Observation: the reader presents the architecture navigation and rendered Mermaid sequence diagrams in the normal page flow.

### Spanish reader — narrow viewport

![Spanish Death Star architecture reader at a narrow viewport](death-star-es-phone.png)

- Browser viewport and capture: **375 × 812**.
- Route: Spanish example at the `/arcshape/` base path.
- Observation: the localized reader remains readable at the narrow viewport; the Playwright scenario also checks for horizontal overflow and validates the generated links.

### Archify — desktop

![Archify static architecture diagram](death-star-archify-desktop.png)

- Browser viewport: **1600 × 1100**; the screenshot is full-page at **1600 × 1285**.
- Route: the bundled Archify static HTML example.
- Observation: renderer identity, source revision, and the architecture component diagram are visible. The E2E scenario exercises keyboard focus and checks the root and `/arcshape/` paths for external runtime fetches.

## Automated browser evidence

The focused local Playwright run passed both showcase scenarios, including EN/ES reader coverage, accessible Mermaid SVG names, and Archify checks against the merged #78 reader contract. The full local Assurance suite passed **7 E2E scenarios** after building the public Astro site and engineering portal as the workflow does. The full local Vitest run passed **23 files / 108 tests** with the repository's CI browser setting (`GITHUB_ACTIONS=true`). The refreshed screenshots show source revision `d9c4113c3671181a6b60f25aa14d07872366f73e`.

The E2E scenarios build both locales at root and `/arcshape/`, assert all twelve sections, check Mermaid and Archify identity/accessibility/provenance, exercise keyboard interaction, and check narrow layout and offline behavior. The local screenshots above are from the same branch revision. The Archify source, generated document, and candidate manifest are retained alongside the example; E2E verifies the pinned renderer/source revisions and generated-artifact hashes.

The branch's current-hosted CI, security, CodeQL, and Assurance outcomes are available from [PR #81](https://github.com/juangcarmona/arcshape/pull/81). The focused Playwright command was `GITHUB_ACTIONS=true npm run test:e2e -- e2e/death-star-showcase.playwright.mjs` (**2 passed**); the full suite command was `GITHUB_ACTIONS=true npm run test:e2e` (**7 passed**). Archify 3.1.0 `deliver` reported 9/9 checks, no warnings, and current provenance; `check --require-provenance` also passed all 9 checks. The earlier Repository conventions failure was fixed by adding the missing `Refs #80` footer to historical commit `f2a6fe4` while preserving its tree and the full commit range.

## Evidence scope and accepted limitations

These captures and checks demonstrate a local static build and its browser behavior. They do not demonstrate a public-site route, Cloudflare Pages configuration, production deployment, or publication approval. They are not a full screen-reader audit and do not establish that every architecture document will be clear or visually compelling. The maintainer approved the adaptation, visual evidence, Spanish content, and test adequacy; accepted limitations are the absence of a full screen-reader audit and Archify's documented accessibility limits.

The Archify contract was initially pinned to PR #79 and has now been revalidated against its merged #78 implementation at `fc0f7986a32eb285955adf24810297dfba5d583c`. The local checks and screenshots do not demonstrate a public-site route, Cloudflare Pages configuration, production deployment, or publication approval.
