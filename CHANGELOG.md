# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- ESLint and Prettier with configs and `lint`, `lint:fix`, `format`, `format:check` scripts
- GitHub Actions CI workflow (lint, format check, build, test with coverage)
- CONTRIBUTING.md with setup and development instructions
- CHANGELOG.md
- Package `types` and `files` fields for publishing; exported `TePurciBeFiLaCmaxes` type from the main entry

### Changed

- `.gitignore` expanded with `dist/`, `coverage/`, `*.log`
- `preprocessing()` typed as `(input: unknown): string` to match runtime behavior for non-string input
- Dictionary dump: Lensisku JSON at `assets/dumps/en.json` (replaces `en.xml`)

### Fixed

- (None in this batch)

---

## [2.0.48] and earlier

See git history and release tags for earlier changes.
