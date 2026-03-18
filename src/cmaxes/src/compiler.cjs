"use strict";

const { generate } = require("peggy");
const tspegjs = require("ts-pegjs");
const { readFileSync, writeFileSync } = require("fs");
const { join, dirname } = require("path");

const dir = dirname(__filename);

const grammar = readFileSync(join(dir, "./cmaxes.peg"), "utf8");
const out = generate(grammar, {
  output: "source",
  format: "commonjs",
  plugins: [tspegjs],
  allowedStartRules: ["text"],
});

writeFileSync(join(dir, "../cmaxes.ts"), out, "utf8");
