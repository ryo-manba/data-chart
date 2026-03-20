# Contributing to data-chart

Thank you for your interest in contributing to data-chart. This guide will help you get started.

## Development Setup

Prerequisites: Node.js >= 24 and pnpm.

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server (examples page)
pnpm test       # Run tests
pnpm build      # Build library to dist/
pnpm lint       # Run linter (oxlint)
pnpm fmt        # Format code (oxfmt)
```

## Code Style

Refer to `CLAUDE.md` for the full style guide. Key points:

- TypeScript strict mode -- no `any`, no `as` casts unless absolutely necessary.
- No classes -- use functions and closures.
- No `default export` in internal modules. Only `index.ts` has a default export.
- Prefer `const` over `let`.
- CSS custom property prefix: `--dc-`
- CSS class prefix: `data-chart-`
- HTML attribute prefix: `data-chart-`

## Commit Convention

Follow this format for commit messages:

```
feat: add horizontal bar chart support
fix: correct pie slice angle calculation
docs: add animation page for data-anim integration
test: add parser edge case for currency strings
chore: update pnpm to 10.x
```

## Pull Requests

- One feature or fix per PR.
- Include tests for any new functionality or bug fix.
- Run `pnpm lint` and `pnpm test` before submitting.
- Keep the bundle size at or below 6 KB gzip (`pnpm size` to check).

## Links

- Visit the [Documentation](https://ryo-manba.github.io/data-chart/docs/getting-started/) to view the full API reference.
- Try the [Playground](https://ryo-manba.github.io/data-chart/playground/) to experiment with charts interactively.
