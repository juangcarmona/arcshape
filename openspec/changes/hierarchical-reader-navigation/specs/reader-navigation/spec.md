<!-- pdac-scope: cited -->

# Spec Delta

## Purpose

Provides a discoverable, accessible hierarchy for supporting architecture documents in the generated reader while preserving stable routes and the existing flat navigation experience.

## ADDED Requirements

### Requirement: Represent supporting documents as a hierarchy

The reader SHALL represent supporting Markdown pages according to their authored folder paths. Folder READMEs SHALL be folder pages and other Markdown files SHALL be leaves.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->

#### Scenario: Render nested folders and leaves

- **WHEN** a section contains nested folders, folder README pages, and supporting Markdown files
- **THEN** the sidebar renders each folder at its authored depth, uses the folder README as its page when present, and renders other Markdown files as leaves beneath their containing folder

#### Scenario: Label a folder without a README

- **WHEN** a folder contains supporting documents but no README page
- **THEN** the sidebar renders a readable label derived from the folder name and keeps the folder's children navigable

#### Scenario: Sort leaves before child folders

- **WHEN** a folder contains both Markdown leaves and child folders
- **THEN** the sidebar lists leaves first and sorts sibling names naturally within each group

### Requirement: Control folder expansion accessibly

Folders with children SHALL expose keyboard-operable toggles with accurate accessible state. Direct nested routes SHALL reveal all ancestors needed to show the current page.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->

#### Scenario: Toggle a folder with keyboard input

- **WHEN** a reader focuses a folder toggle and activates it with a pointer or keyboard
- **THEN** only that folder's child list changes visibility and the toggle's accessible expanded state changes to match

#### Scenario: Open ancestors for a direct nested route

- **WHEN** the reader opens a stable route for a nested supporting page directly
- **THEN** all ancestor folders are expanded and the current page is marked as the current navigation item

### Requirement: Show contextual breadcrumbs

Supporting pages SHALL show a breadcrumb trail for their folder path. A folder step SHALL link only when that folder has a README page.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->

#### Scenario: Link breadcrumb folders with README pages

- **WHEN** a supporting page is nested under folders that have README pages
- **THEN** the breadcrumb displays each folder and links it to the corresponding stable README route

#### Scenario: Keep README-less breadcrumb steps contextual

- **WHEN** a supporting page is nested under a folder without a README page
- **THEN** the breadcrumb displays that folder name without generating a broken link

### Requirement: Preserve flat navigation compatibility

Sections with only flat supporting files SHALL retain their existing visual hierarchy, stable routes, search results, section navigation, and self-contained generated HTML behavior.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="UC-PUBLISH-ARCHITECTURE-VIEW" digest="sha256:9ce6cd65b911aeec3601b986283f966a0232a1c59a3534f975fff4c3abddea9c" -->

#### Scenario: Render a flat section as before

- **WHEN** a section has supporting Markdown files without nested folders
- **THEN** the sidebar keeps the existing flat supporting-document presentation and each existing route remains unchanged

#### Scenario: Search nested and flat pages

- **WHEN** a reader searches for text from any section or supporting page
- **THEN** search returns the matching page and its stable route regardless of whether its sidebar entry is nested or flat
