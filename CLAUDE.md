# CLAUDE.md — data-chart

## Project

data-chart is a zero-dependency JavaScript library that converts HTML `<table>` elements into SVG charts using data attributes. Part of the `data-*` ecosystem (sibling of `data-anim`).

**Critical**: data-chart does NOT contain animation logic. Animation is handled by data-anim. data-chart only copies `data-anim-*` attributes from the table to the generated container.

Tagline: "Chart your tables. No JavaScript to write."

## Toolchain

- **Package manager**: pnpm (DO NOT use npm or yarn)
- **Build**: Vite Library Mode (`vite.config.ts`)
- **Test**: Vitest + happy-dom (`vitest.config.ts`)
- **Lint**: oxlint (DO NOT use eslint)
- **Format**: oxfmt (DO NOT use prettier)
- **Types**: TypeScript strict mode + vite-plugin-dts
- **CI**: GitHub Actions
- **Node.js**: >= 24
- **License**: MIT

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server (examples page)
pnpm build            # Build library to dist/
pnpm test             # Run Vitest
pnpm test:watch       # Vitest watch mode
pnpm lint             # Run oxlint
pnpm fmt              # Run oxfmt
pnpm fmt:check        # Check formatting
pnpm size             # Check bundle size (must be ≤ 6KB gzip)
pnpm docs:dev         # Dev docs site (Astro)
pnpm docs:build       # Build docs site
```

## Code Style

- TypeScript strict mode — no `any`, no `as` casts unless absolutely necessary
- Prefer `const` over `let`
- No classes — use functions and closures
- No `default export` in internal modules — use named exports
- `index.ts` is the only file with a default export
- All SVG elements created with `document.createElementNS('http://www.w3.org/2000/svg', tagName)`
- CSS custom property prefix: `--dc-` (short for data-chart)
- CSS class prefix: `data-chart-` (full name for external API)
- HTML attribute prefix: `data-chart-` (full name)

## File Organization

```
src/
├── index.ts          # Entry point. Auto-init + global API + MutationObserver
├── parser.ts         # Table → ParsedData
├── renderer/
│   ├── common.ts     # SVG helpers, viewBox, grid, axis, legend
│   ├── bar.ts        # Vertical + horizontal + stacked
│   ├── line.ts       # Line chart
│   ├── area.ts       # Area chart
│   ├── pie.ts        # Pie chart
│   └── donut.ts      # Donut chart
├── theme.ts          # Dark mode, palette, CSS vars
├── a11y.ts           # ARIA attributes
├── forward.ts        # ★ Copy data-anim-* attrs from table → container
├── toggle.ts         # Source table toggle
├── debug.ts          # Debug logging
├── observer.ts       # MutationObserver
└── types.ts          # All types/interfaces
```

**There is NO `animate.ts`.** Animation is data-anim's responsibility.

## Architecture Rules

1. **No dependencies** — zero external packages in `dependencies`
2. **No DOM library** — no jQuery, no D3
3. **SVG only** — no Canvas, no WebGL
4. **Data attributes only** — no JS config objects as primary API
5. **Progressive enhancement** — table must work without JS
6. **Bundle ≤ 6KB gzip**
7. **No animation** — no SVG `<animate>`, no CSS `@keyframes`, no `requestAnimationFrame`
8. **Attribute forwarding** — copy `data-anim-*` from table to container for data-anim

## What NOT to do

- ❌ Do NOT create `animate.ts` or any animation module
- ❌ Do NOT generate SVG `<animate>` elements
- ❌ Do NOT add `data-chart-animate` or `data-chart-animate-*` attributes
- ❌ Do NOT handle `prefers-reduced-motion` (data-anim's job)
- ❌ Do NOT add `--dc-animation-*` CSS custom properties
- ❌ Do NOT import or depend on data-anim

## Testing Rules

- Every parser edge case needs a test
- Every chart type needs at minimum: SVG element count test, coordinate range test
- **Every renderer test must assert: zero `<animate>` elements in output**
- `forward.ts` test: verify `data-anim-*` copied, `data-chart-*` not copied

## i18n Rules

- Library source: English only
- README: English. Separate README.ja.md for Japanese.
- Docs site: EN + JA from day one

## Commit Convention

```
feat: add horizontal bar chart support
fix: correct pie slice angle calculation
docs: add animation page for data-anim integration
test: add parser edge case for currency strings
chore: update pnpm to 10.x
```

## Important Notes

- "No JavaScript to write" means the USER writes no JS. The library itself is JS.
- Charts render instantly on DOMContentLoaded — no animation delay
- MutationObserver catches dynamically added tables (SPA support)
- `data-anim-*` attributes on tables are copied to `.data-chart-container` for data-anim to process
- data-anim is completely optional — data-chart works perfectly alone
