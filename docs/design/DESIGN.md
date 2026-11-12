# ArcShape public-site design

The public site uses the semantic CSS roles from the pinned `@juangcarmona/lighthouse-ui@0.2.1` package. Its distributed `DESIGN.md` and `tokens.css` define the shared contract. Product styling lives in `src/public-site/src/styles/site.css`; the engineering portal and packaged architecture reader have separate styles.

The public pages use Lighthouse canvas, surface, text, action, border, focus, font, spacing, radius, and motion roles. Public-page overrides set body text to 16px, supporting text to at least 14px, introductory text to 18px, and controls to at least 44px tall. Paragraphs grow with user font settings. Layout uses 20px mobile gutters and a bounded desktop width.

The root declares `data-lh-theme` as light, dark, or system. The public shell retains the existing `arcshape-appearance` storage key and maps its saved `auto` value to the system theme. Storage failures leave the current page usable. Navigation uses native `details`, opens by default without JavaScript, and gains mobile dismissal and focus handling when scripts are available.

Real architecture excerpts are imported from canonical Markdown during the build. The arc42 guide uses the framework’s official names and numbers, original summaries, and a labelled hypothetical booking-system example. Public messaging leads with software architecture documentation; AI assistance is explained in the workflow.

Browser verification covers both pages at 320, 390, 768, 900, and 1440px, including color contrast, type size, controls, keyboard behavior, appearance, text resizing, and reduced motion. Lighthouse styling and the approved content hierarchy take precedence over Taste’s optional visual effects and viewport-sized section recipes.
