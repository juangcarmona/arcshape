<!-- pdac-scope: cited -->

# Spec Delta

## Purpose

Provides a static, public ArcShape product site that explains the current product to prospective users while remaining separate from generated engineering documentation.

Product claims must follow the approved capability model and authority boundary.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7ced0abebbb528485c8fe92cdc6ce20d9e0c53a7e0b60d4fe3678d2cc29bd640" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

## ADDED Requirements

### Requirement: Public product site presents ArcShape's current product

The public site MUST explain ArcShape's current capabilities using ArcShape-owned identity, assets, and styles in a visual family aligned with ProductShape. Copy MUST match ArcShape's active product definition and distinguish current capabilities from future work. The site MUST NOT depend on ProductShape site packages or assets.

#### Scenario: Reader finds the public site and engineering portal
- **WHEN** a reader visits `https://arcshape.dev` after production activation
- **THEN** the site presents ArcShape's product information and a working link to the engineering portal

#### Scenario: Public copy stays within approved product intent
- **WHEN** the site describes an ArcShape capability
- **THEN** the claim is supported by ArcShape's active product model and does not present planned work as available

### Requirement: Public site previews are separate from production

The public site MUST provide reviewable branch or pull-request previews. `main` is the production branch, and production deployment and custom-domain activation MUST remain disabled until the maintainer has reviewed a preview and approved activation.

#### Scenario: Pull request creates a reviewable preview
- **WHEN** a pull request changes public-site sources
- **THEN** a preview of that change is available without replacing the production site

#### Scenario: Production activation requires maintainer approval
- **WHEN** the production site or `arcshape.dev` domain has not been approved for activation
- **THEN** merging a change does not publish it to the production hostname

### Requirement: Public site does not collect user or repository data

The ArcShape public site MUST remain a static presentation and MUST NOT add a form, tracker, or ArcShape-operated service that collects or transmits user or repository information.

#### Scenario: Visitor reads the site without submitting data
- **WHEN** a visitor browses any public-site page
- **THEN** the site serves static content without sending visitor or repository information to an ArcShape-operated service

### Requirement: Public site is accessible and responsive

The public site MUST provide keyboard-usable navigation, text alternatives for informative images, readable contrast, and layouts that work at desktop and mobile viewport sizes.

#### Scenario: Keyboard navigation
- **WHEN** a visitor navigates the site without a pointer
- **THEN** links and controls remain reachable, visible, and operable

#### Scenario: Mobile viewport
- **WHEN** a visitor opens the site at a narrow viewport
- **THEN** content and navigation remain available without horizontal overflow
