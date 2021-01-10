import { readFileSync, writeFileSync } from "fs-extra"
const mkdirp = require('mkdirp')
const path = require("path-extra")
import { parse } from "fast-xml-parser"
import { decode } from "he"

const bangu = "en"
const dump = readFileSync(`${__dirname}/../../assets/dumps/${bangu}.xml`, {
  encoding: "utf8",
})
  .replace(/(&lt;|<)script.*?(&gt;|>).*?(&lt;|<)/g, "&lt;")
  .replace(/(&lt;|<)\/script(&gt;|>)/g, "")
const json_raw = JSON.stringify(parse(dump, {
  attributeNamePrefix: "",
  ignoreAttributes: false,
  allowBooleanAttributes: false,
  parseNodeValue: false,
  parseAttributeValue: false,
  attrValueProcessor: (a: any) => decode(a, { isAttributeValue: true }),
  tagValueProcessor: (a: any) => decode(a),
}))
mkdirp.sync(path.join(__dirname, `../../dist/assets/dumps/`))

writeFileSync(
  path.join(__dirname, `../../dist/assets/dumps/${bangu}.json`),
  json_raw,
  { encoding: "utf8" }
)
