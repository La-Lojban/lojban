import { generate } from "peggy";
import tspegjs from "ts-pegjs";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const grammar = readFileSync(join(__dirname, "./cmaxes.peg"), "utf8");
const out = generate(grammar, {
  output: "source",
  format: "commonjs",
  plugins: [tspegjs],
  allowedStartRules: ["text"],
});

writeFileSync(join(__dirname, "../cmaxes.ts"), out, "utf8");
