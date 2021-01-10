"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const mkdirp = require('mkdirp');
const path = require("path-extra");
const fast_xml_parser_1 = require("fast-xml-parser");
const he_1 = require("he");
const bangu = "en";
const dump = fs_extra_1.readFileSync(`${__dirname}/../../assets/dumps/${bangu}.xml`, {
    encoding: "utf8",
})
    .replace(/(&lt;|<)script.*?(&gt;|>).*?(&lt;|<)/g, "&lt;")
    .replace(/(&lt;|<)\/script(&gt;|>)/g, "");
const json_raw = JSON.stringify(fast_xml_parser_1.parse(dump, {
    attributeNamePrefix: "",
    ignoreAttributes: false,
    allowBooleanAttributes: false,
    parseNodeValue: false,
    parseAttributeValue: false,
    attrValueProcessor: (a) => he_1.decode(a, { isAttributeValue: true }),
    tagValueProcessor: (a) => he_1.decode(a),
}));
mkdirp.sync(path.join(__dirname, `../../dist/assets/dumps/`));
fs_extra_1.writeFileSync(path.join(__dirname, `../../dist/assets/dumps/${bangu}.json`), json_raw, { encoding: "utf8" });
