var pegjs = require("pegjs");
var tspegjs = require("ts-pegjs");
const { readFileSync, writeFileSync } = require('fs-extra')
const path = require('path-extra')

const a = pegjs.generate(readFileSync(path.join(__dirname, "./cmaxes.peg"), { encoding: "utf8" }), {
  output: 'source',
  format: "commonjs",
  plugins: [tspegjs]
})

writeFileSync(path.join(__dirname, "../cmaxes.ts"),a,{encoding: 'utf8'})

