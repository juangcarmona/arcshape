# Architecture reader screenshots

These screenshots are review evidence for the generated ArcShape reader. The canonical source remains the Markdown files in `docs/architecture/`; do not edit the generated HTML or screenshots by hand.

From the repository root, rebuild the reader and refresh all screenshots with:

```sh
node bin/arcshape.mjs site build --title ArcShape
node tools/arc42-site/capture-evidence.mjs \
  docs/architecture-site/index.html \
  docs/architecture/evidence
```

The capture script uses a 1440 × 1000 viewport and writes the overview, system-context, and building-block views. Review the resulting images against the Markdown changes before attaching them to a pull request.
