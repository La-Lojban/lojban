# lojban

**Parsers and tools for the Lojban language.** A single npm package for morphological and syntactic parsing, orthography and transliteration, lujvo (compound word) handling, dictionary lookup, English glossing, and related utilities.

[![npm version](https://badge.fury.io/js/lojban.svg)](https://www.npmjs.com/package/lojban)
[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

---

## Table of contents

- [What is Lojban?](#what-is-lojban)
- [What this package does](#what-this-package-does)
- [Requirements](#requirements)
- [Install](#install)
- [Quick start](#quick-start)
- [Usage examples](#usage-examples)
- [API reference](#api-reference)
  - [Parsing](#parsing)
  - [Orthography & transliteration](#orthography--transliteration)
  - [Lujvo & morphology](#lujvo--morphology)
  - [Dictionary & glossing](#dictionary--glossing)
  - [Other utilities](#other-utilities)
- [TypeScript](#typescript)
- [Development](#development)
- [License](#license)

---

## What is Lojban?

[Lojban](https://mw.lojban.org/papri/Lojban) is a constructed, syntactically unambiguous language based on predicate logic. It has a well-defined grammar (described in [The Complete Lojban Language](https://lojban.github.io/cll/), the CLL), a Latin-based orthography, and a rich system of compound words (lujvo) built from rafsi.

---

## What this package does

This package provides a single programmatic interface to:

| Area | Capabilities |
|------|--------------|
| **Parsing** | Morphological parsing (la cmaxes), Ilmentufa-style syntactic parsing (MTC output), optional Loglan parsing; text preprocessing (digits, apostrophes, etc.). |
| **Orthography & transliteration** | La krulermorna, Cyrillic, Bopomofo (Zhuyin), Tibetan, IPA. |
| **Lujvo & morphology** | Build and split lujvo, test for gismu/lujvo, expand lujvo to “zo zei zo” form. |
| **Dictionary & glossing** | Load the bundled English dictionary, look up words and selmaho, get rafsi, gloss Lojban text to English (or other languages). |
| **Other** | Chinese character conversion (with Bopomofo for fu'ivla/cmevla), Morse-like output, ROT13, Lojban ↔ Loglan conversion. |

All of this is usable from Node.js (and bundlers) via a synchronous API where possible, and Promises for parser backends that load on demand.

---

## Requirements

- **Node.js** ≥ 20 (see `engines` in `package.json` for the exact range).

---

## Install

```bash
npm install lojban
```

With pnpm:

```bash
pnpm add lojban
```

---

## Quick start

```js
const lojban = require("lojban");

// Morphological parse
const result = lojban.romoi_lahi_cmaxes("coi ro do");
console.log(result.tcini);        // "snada" | "fliba"
console.log(result["te spuda"]);  // parse output

// Transliterate
lojban.krulermorna("coi ro do");   // la krulermorna
lojban.rukylermorna("coi ro do");  // Cyrillic

// Gloss to English (async)
const words = await lojban.gloss("coi ro do", "en", undefined, false);
console.log(words.join(" "));     // "hello each-of you"
```

---

## Usage examples

**Parse and inspect morphology**

```js
const r = lojban.romoi_lahi_cmaxes("coi ro do");
if (r.tcini === "snada") {
  console.log(r["te spuda"]);
  // [["cmavo","coi"],["drata"," "],["cmavo","ro"],["drata"," "],["cmavo","do"]]
}
```

**Build and split lujvo**

```js
lojban.jvozba(["lujvo", "zbasu"]);   // scored candidates, e.g. { lujvo: "jvozba", score: 5858 }
lojban.jvokaha("jvozba");            // ["jvo", "zba"]
lojban.zeizei("lonu muvgau broda cumo");
// "lo nu muvdu zei gasnu broda cu mo"
```

**IPA and orthographies**

```js
lojban.lojban2ipa("coi", "vits", lojban.romoi_lahi_cmaxes);  // includes ʃ, etc.
lojban.krulermorna("coi ro do");  // "cǫ ro do"
lojban.jbopomofo("coi");          // Bopomofo (Zhuyin)
```

**Dictionary and glossing**

```js
const doc = lojban.dump({ bangu: "en" });
lojban.word({ word: "coi", jsonDoc: doc });
lojban.selmaho({ word: "COI", bangu: "en" });  // { full, partial, CLL }
lojban.rafsi_giho_nai_se_rafsi("bloti");
// { valsi: "bloti", rafsi: ["lot","blo","lo'i","blot"], selrafsi: [] }
```

---

## API reference

The package exports the following. Optional parameters are marked with `?`. Functions that return Promises are marked **async**.

---

### Parsing

| Function | Description |
|----------|-------------|
| `romoi_lahi_cmaxes(text)` | Morphological parse using the la cmaxes grammar. Returns `{ tcini, "te spuda", kampu }`. `tcini` is `"snada"` (success) or `"fliba"` (failure). `"te spuda"` is the parse result (array of `[type, token]`) or an error message. Synchronous. |
| `cmaxes({ te_gerna, versiio? })` | Same morphological parser with an optional `versiio`. Same return shape as `romoi_lahi_cmaxes`. |
| `ilmentufa_off(text, mode?, preprocess?)` | **Async.** Ilmentufa parser with MTC-style output. `mode` defaults to `"MTC"`. If `preprocess` is true, runs `preprocessing(text)` first. |
| `ilmentufa_exp(text, mode?, preprocess?)` | **Async.** Ilmentufa experimental (beta) parser. Same arguments and return shape as `ilmentufa_off`. |
| `loglytufa_master(text)` | **Async.** Loglan parser; returns the same `{ tcini, "te spuda", kampu }` shape. |
| `preprocessing(input)` | Normalize text for parsing: digits → Lojban number words, apostrophe normalization, stripping of non-ASCII and some punctuation, etc. Accepts `unknown`; returns a string or `"ERROR: Wrong input type."` for invalid input. Exported for use before other parsers. |

**Parse result type:** On success, `"te spuda"` is an array of pairs `[type, token]` (e.g. `["cmavo","coi"]`, `["drata"," "]`). On failure, `"te spuda"` and `kampu` are error messages (string or Error).

---

### Orthography & transliteration

| Function | Description |
|----------|-------------|
| `krulermorna(text)` | Convert to la krulermorna orthography (e.g. `"cǫ ro do"`). |
| `rukylermorna(text)` | Convert to Cyrillic (Bulgarian/Russian) orthography. |
| `jbopomofo(text)` | Convert to Bopomofo (Zhuyin). |
| `tibetan(text)` | Convert to Tibetan script. |
| `lojban2ipa(text, mode?, gentufa?)` | IPA transcription. `mode` e.g. `"vits"` for a specific style. Optional `gentufa` is the parser to use for analysis (default: `romoi_lahi_cmaxes`). |

---

### Lujvo & morphology

| Function | Description |
|----------|-------------|
| `jvozba(selcmima)` | Build lujvo from a rafsi list. `selcmima` can be a string or array (e.g. `["lujvo","zbasu"]`). Returns an array of `{ lujvo, score }` candidates, sorted by score. |
| `jvokaha(lujvo)` | Split a lujvo into rafsi. Throws if the word is not a valid lujvo. |
| `jvokaha2(lujvo)` | Split into rafsi without validation; always returns an array. |
| `jvokaha_gui(lujvo)` | Split and resolve to selrafsi where possible (e.g. `"xojyka'a"` → `["-xoj-","katna"]`). |
| `xulujvo(text)` | Returns whether `text` is a lujvo (uses the morphological parser). |
| `xugismu(text)` | Returns whether `text` is a gismu. |
| `zeizei(text, returnFullInfo?)` | Expand lujvo in `text` to “zo zei zo” form (e.g. `"lonu muvgau"` → `"lo nu muvdu zei gasnu"`). If `returnFullInfo` is true, returns full info array instead of a string. |

---

### Dictionary & glossing

The package ships with an English dictionary in `assets/dumps/en.json` (Lensisku export). That included dump is used by default for `dump`, `word`, `selmaho`, `rafsi`, `rafsi_giho_nai_se_rafsi`, and `gloss` when you do not pass a custom `jsonDoc`. It is loaded on demand when you call those functions.

| Function | Description |
|----------|-------------|
| `dump({ doc?, bangu? })` | Load the dictionary. `bangu` defaults to `"en"`. Returns the parsed document (used as `jsonDoc` in other functions). |
| `word({ word, jsonDoc?, bangu? })` | Look up a word in the dictionary. Returns an array of entries. |
| `selmaho({ word, jsonDoc?, bangu? })` | Get selmaho info for a word: `{ full, partial, CLL }`. |
| `rafsi(valsi, jsonDoc?, bangu?)` | Get rafsi and selrafsi for a word. |
| `rafsi_giho_nai_se_rafsi(valsi, jsonDoc?, bangu?)` | Full rafsi info: `{ valsi, rafsi, selrafsi }`. |
| `gloss(text, bangu?, jsonDoc?, pilno_logentufa?)` | **Async.** Gloss Lojban text to the given language (default `"en"`). Returns `Promise<string[]>` (array of gloss words). If `pilno_logentufa` is true (default), uses the Ilmentufa parser for structure. |

---

### Other utilities

| Function | Description |
|----------|-------------|
| `anji(text)` | Convert Lojban to Chinese characters; fu'ivla and cmevla use Bopomofo. |
| `modzi(text, rawOutput?)` | Morse-like representation. If `rawOutput` is true, returns the input unchanged. |
| `rotpaci(text)` | ROT13 encoding (Latin letters only). |
| `lojban2loglan(text)` | Convert Lojban text to Loglan. |
| `loglan2lojban(text)` | Convert Loglan text to Lojban. |

---

## TypeScript

The package ships with TypeScript declarations. The main parse result type is exported as `TePurciBeFiLaCmaxes`:

```ts
import lojban, { type TePurciBeFiLaCmaxes } from "lojban";

const r: TePurciBeFiLaCmaxes = lojban.romoi_lahi_cmaxes("coi ro do");
if (r.tcini === "snada") {
  const tokens: [string, string][] = r["te spuda"];
  // ...
}
```

---

## Development

This project uses **pnpm**.

```bash
pnpm install
pnpm run build
pnpm test
```

- **Build:** Compiles TypeScript, runs the dumper (fetches Lensisku en/json and writes `assets/dumps/en.json`), and compiles the grammar. The file `assets/dumps/en.json` can be committed or generated at build time.
- **Test:** `pnpm test` runs Jest against the TypeScript source; no build needed for tests that do not use the dictionary.
- **Coverage:** `pnpm run test:coverage` generates a report in `coverage/`. `pnpm run test:coverage:check` enforces a 90% coverage threshold.
- **Lint:** `pnpm run lint` / `pnpm run lint:fix` (ESLint).
- **Format:** `pnpm run format` / `pnpm run format:check` (Prettier).

See [CONTRIBUTING.md](CONTRIBUTING.md) for full setup, pre-commit hooks, and contribution guidelines.

---

## License

ISC © Gleki
