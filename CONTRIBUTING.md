# Contributing to lojban

Thanks for your interest in contributing. This document explains how to set up the project and submit changes.

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 10 (recommended; the project uses `pnpm`)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/lojban/lojban.git
   cd lojban
   ```

2. Install dependencies (this also sets up the Git pre-commit hook via Husky):
   ```bash
   pnpm install
   ```

3. Build the project. The build runs the dumper, which fetches the Lensisku English dictionary and writes `assets/dumps/en.json`:
   ```bash
   pnpm run build
   ```

## Development workflow

- **Build:** `pnpm run build` — compiles TypeScript, runs the dumper (fetches and writes `assets/dumps/en.json`), and compiles the grammar.
- **Test:** `pnpm test` — runs Jest against the TypeScript source; no build needed for tests that don’t use the dictionary.
- **Test with coverage:** `pnpm run test:coverage` — runs tests and generates a coverage report in `coverage/`. The project enforces 90% coverage (lines, functions, branches, statements). Use `pnpm run test:coverage:check` to fail the run if coverage is below the threshold.
- **Lint:** `pnpm run lint` — runs ESLint on `src/` and `test/`. Use `pnpm run lint:fix` to auto-fix where possible.
- **Format:** `pnpm run format` — formats code with Prettier. Use `pnpm run format:check` to only check formatting.

**Pre-commit hook:** On each commit, Husky runs lint-staged, which runs ESLint (with `--fix`, so unused imports and other fixable issues are fixed) and Prettier on staged `.ts` files. Fix any remaining errors (e.g. unused variables: remove them or prefix with `_`) before the commit succeeds.

**VS Code:** The repo includes `.vscode/settings.json` and `.vscode/extensions.json`. If you use VS Code (or Cursor), install the recommended extensions (ESLint, Prettier) so that format-on-save and ESLint fix-on-save work.

Before submitting a pull request, please run:

```bash
pnpm run lint
pnpm run format:check
pnpm run build
pnpm run test:coverage
```

## Submitting changes

1. Create a branch for your change.
2. Make your edits and ensure the commands above pass.
3. Open a pull request against `master` (or `main`) with a clear description of the change.
4. Ensure CI (lint, format check, build, tests) passes.

## Dictionary dump (`assets/dumps/en.json`)

The dumper fetches the Lensisku English dictionary (cached en/json) and writes it to `assets/dumps/en.json` during `pnpm run build`. That file is the **included dump**: the app and tests use it by default for `dump`, `word`, `selmaho`, `rafsi`, and `gloss` when no custom dictionary is passed (same role as the old `en.xml`). Commit `assets/dumps/en.json` so tests and builds work offline without running the dumper first.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC).
