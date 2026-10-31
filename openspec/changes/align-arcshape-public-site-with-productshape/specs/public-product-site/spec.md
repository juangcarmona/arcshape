<!-- pdac-scope: cited -->

# Spec Delta

## Purpose

Presents ArcShape's current product to prospective users through a localized public site that is visually related to ProductShape while retaining ArcShape's own identity and remaining separate from engineering artifacts.

## ADDED Requirements

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:ac09dcb4dd5f8d437006a51f654c3f1b3d218dc223ca1ebb0a67311bdfe6b0ed" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ADR-WORKFLOWS" digest="sha256:1301b243301cd5655ee38a47d55af3b9713bd2396d6db5d15e50a910d0fb9254" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="FR-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:03fea6b807b52d2c0a6b5a45578f39a2c17bd7a6bc9f62505c27ddebbdc2ee5e" -->
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->
<!-- pdac:cite id="FR-PRODUCT-DEFINITION-LINKS" digest="sha256:d653de7a070313b78fa267d4419b7f31544e393c3c1ac2721ac0dbc231d92a26" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ff3d03ebe93668cb0392a672fe63b9925404fab9dc2fb7891931f1f5d2ea799d" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

### Requirement: Public site provides a localized product journey
The public site MUST retain its established route set and navigation in English and Spanish. Locale content and route mappings MUST be structured so another locale can be added without duplicating page templates. Root `/` MUST resolve to the established default-language overview, and language switching MUST preserve the current page when a translation exists.

#### Scenario: Reader opens a localized page
- **WHEN** a reader visits an English or Spanish page route
- **THEN** the page, navigation, title, description, and language control use that locale

#### Scenario: Reader changes language
- **WHEN** a reader switches language from a page with a corresponding translation
- **THEN** the equivalent page in the selected language opens

#### Scenario: Root route opens the default overview
- **WHEN** a reader visits `/`
- **THEN** the English overview is served

### Requirement: Astro migration preserves the established public-site experience
Astro MUST statically render the public-site shell. Replacing its rendering engine MUST preserve its established appearance, route URLs, themes, responsive behavior, typography, spacing, and navigation. The public site MUST retain ArcShape's lockup, orbit-style hero illustration, blue and mint identity, workflow narrative, and architecture-source-to-reader story. It MUST NOT use ProductShape-branded assets or copy.

#### Scenario: Reader sees the established public design after migration
- **WHEN** a reader opens an existing public-site route after the Astro migration
- **THEN** the route retains its established visual design, branding, theme behavior, and navigation

#### Scenario: Reader opens a localized page
- **WHEN** a reader opens either public locale
- **THEN** the established light appearance is retained without adding a new appearance control

#### Scenario: Reader uses the site on a narrow screen
- **WHEN** a reader opens a route at a phone viewport
- **THEN** the established responsive navigation and layout remain usable without new clipping or horizontal overflow

### Requirement: Public claims match current ArcShape capabilities
Public pages MUST describe only capabilities supported by ArcShape's active product model and current implementation. Proposed work MUST be identified as future work.

#### Scenario: Reader evaluates a product claim
- **WHEN** a public page describes a capability or workflow
- **THEN** the claim matches an active product-model artifact and implementation evidence, and does not present proposed work as available

### Requirement: Public site explains its operating boundary
The site MUST present ArcShape as repository-based tooling and MUST NOT imply that ArcShape operates a hosted product service or collects user or repository data.

#### Scenario: Reader distinguishes ArcShape from a hosted service
- **WHEN** a public page describes how ArcShape is used
- **THEN** it presents ArcShape as repository-based tooling and does not imply a hosted ArcShape service or data collection

### Requirement: Public site builds to an isolated Cloudflare Pages artifact
The public site MUST build as a static artifact from project root `src/public-site` into `dist/`. Cloudflare Pages MUST use Git integration with reviewable pull-request previews and `main` as its designated production branch. Production deployment and custom-domain activation MUST remain gated until a maintainer reviews a preview and explicitly approves activation. GitHub Actions MUST validate the build without deploying to Cloudflare or requiring a Cloudflare API token.

#### Scenario: Pull request produces a preview
- **WHEN** a pull request changes the public-site source
- **THEN** Cloudflare Pages provides a reviewable preview without replacing production

#### Scenario: GitHub Actions validates the deployable output
- **WHEN** public-site validation runs in GitHub Actions
- **THEN** it builds and verifies the static `dist/` artifact without deploying it to Cloudflare

#### Scenario: Production remains gated
- **WHEN** no explicit production activation approval has been given
- **THEN** merging to `main` does not publish to `arcshape.dev` or activate its custom-domain binding

### Requirement: Public and engineering sites remain independent static publications
The public site MUST generate a static Cloudflare artifact independent of the GitHub Pages engineering portal. It MUST retain its current route and content boundary and MUST NOT introduce server-side runtime behavior, ProductShape runtime packages, or ProductShape assets.

#### Scenario: Reader navigates without a pointer
- **WHEN** a reader uses only the keyboard
- **THEN** every navigation item and appearance control is reachable, operable, and visibly focused

#### Scenario: Reader follows an engineering link
- **WHEN** a reader selects an engineering-artifact link
- **THEN** it opens the existing GitHub Pages engineering portal without replacing or sharing its published output
