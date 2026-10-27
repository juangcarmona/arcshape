# Archify subset in ArcShape

This directory contains Archify 3.2.0 renderer code under its MIT license, pinned to the revision recorded in `inventory.json`. The inventory records upstream and distributed SHA-256 hashes. Reproduce it with `node scripts/vendor-archify.mjs <clean-pinned-checkout>` in the ArcShape source repository.

ArcShape excludes all third-party brand artwork and embedded fonts. The generated brand registry is empty; the template's font block is empty and font declarations use system monospace. Renderer-owned generic symbols remain. The upstream third-party notice is retained for provenance; its descriptions of embedded brand artwork do not describe this tailored distribution.

The upstream CLI, updater, explainer and optional authoring tools are not distributed. ArcShape accepts only its documented safe input subset and owns output paths. The renderer is trusted build-time package code, not an operating-system sandbox. Browser runtimes execute inside opaque-origin iframes in both embedded and dedicated views.

The template's focus, reachability, route and semantic-lens dictionaries use Map/Set instead of dynamic object properties for URL-derived keys. The reproducible tailoring is in `scripts/harden-archify-viewer.mjs`; inventory hashes include this security change. Public depth snapshots retain their plain-data representation.
