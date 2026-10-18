<!-- pdac-scope: cited -->

# Spec Delta

## Purpose

Provides a static, public ArcShape product site that explains the current product to prospective users while remaining separate from generated engineering documentation.

Product claims must follow the approved capability model and authority boundary.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:0c2a1bb402fcf272e5ecfe15282e8d15dccd7fb57992a344071757f82cf457a7" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## ADDED Requirements

### Requirement: Public product site presents ArcShape's current product

The public site MUST explain ArcShape's current capabilities using its identity and the shared ProductShape design language. Copy MUST match the active product definition and distinguish available capabilities from future work.

#### Scenario: Reader finds the public site and engineering portal
- **WHEN** a reader visits `https://arcshape.dev` after production activation
- **THEN** the site presents ArcShape's product information and a working link to the engineering portal

#### Scenario: Public copy stays within approved product intent
- **WHEN** the site describes an ArcShape capability
- **THEN** the claim is supported by the active ProductShape model and does not present planned work as available

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
