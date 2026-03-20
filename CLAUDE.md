# data-chart

A zero-dependency library that converts HTML `<table>` elements into SVG charts using data attributes.

## Key Rules

- **No animation**: data-chart does NOT contain animation logic. Never create `<animate>` elements, CSS `@keyframes`, or `requestAnimationFrame`. Animation is handled by the sibling library data-anim.
- **Attribute forwarding**: `data-anim-*` attributes on tables are copied to `.data-chart-container` for data-anim to process. Do NOT import or depend on data-anim.
- **Bundle size**: must be ≤ 6KB gzip. Run `pnpm size` to check.

## i18n

- When adding, editing, or deleting docs pages, always update both English (`docs/src/pages/docs/`) and Japanese (`docs/src/pages/ja/docs/`) simultaneously.
