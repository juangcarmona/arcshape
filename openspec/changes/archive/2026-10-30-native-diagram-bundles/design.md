<!-- pdac-scope: cited -->
# Design

## Context

The existing image/source pair already supports SVG in Markdown and a native widget in the interactive reader. It lacks Markdown companions and coordinated overwrite protection.

## Goals / Non-Goals

Migrate every current architecture diagram into a local diagrams directory and publish the same rich reader on Bastion. Keep legacy sources usable. Do not invent universal lossless native/Mermaid conversion.

## Decisions

Extend explicit preview tooling with a diagram-bundle command. Generate standard fenced Mermaid Markdown with source/content hashes, and SVG with content provenance. Check freshness during publication; refuse authored or modified outputs. Keep the JSON as source authority. Export ordered sequence messages as Mermaid sequence syntax; export other supported models as labeled semantic flowcharts with structural relationships, boundaries, attributes, timing and notes retained. This avoids claiming visual-notation parity. Unsupported semantics fail export rather than producing a false equivalent. Recognize only generated companion-only Markdown as non-navigation artifacts; ordinary supporting Markdown still renders.

Initialization uses a native activity view to preserve its loop and mutually exclusive file outcomes. Deployment is reauthored as native structure from the existing reviewed source. Both migrations retain the same architectural claims and are visually reviewed.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:02d4c9bc5238c5d6bc5e162f0cda52dee6c00a5b0229f8b841f811a533b8f06c" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:c49ed716a9b078b766666bf79afa2e999a366a9444732c659691b34baba853e1" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:fb9d6549efa4555755042489cd9eda2439cf6afad7d0171663ef2b9edeecd33d" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:8372d5e6f9b51e0e9d468289d65d352a7c930089dea72897a9bffe56f894e053" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:e1297804e0fc64a188b066d06c7c6acddb0c897f7554f99f0454898c4f545c4e" -->

## Risks / Trade-offs

Three files can diverge → one source, hashes and explicit check. Markdown can accidentally become duplicate reader pages → exact generated-companion recognition and tests. Semantic projections differ visually → document their scope and test parsed identities/relationships. Unsafe paths/overwrites → reuse root confinement and reject modified assets. No independent agents are launched at the maintainer's explicit request; human judgement remains required.
