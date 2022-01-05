"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rafsi_giho_nai_se_rafsi = exports.rafsi = exports.selmaho = exports.word = exports.wiktionary = exports.gloss = exports.fastParse = void 0;
const R = require("ramda");
const axios_1 = require("axios");
const querystring_1 = require("querystring");
const cll_1 = require("./cll");
const sozysozbot_jvozba_1 = require("../sozysozbot_jvozba");
const items = {
    a: "and/or",
    ba: "in-future",
    "bu'u": "at",
    ca: "at-present",
    "co'a": "become",
    "co'o": "goodbye",
    coi: "hello",
    dansu: "dance(s)",
    "dansu@n": "dancer(s)",
    doi: "oh",
    "e'a": "[permission-granted]",
    "e'u": "I-suggest",
    e: "and",
    "e,nai": "and-not",
    "gi'a": ",-and/or",
    "gi'e": ",-and",
    "gi'u": "whether-or-not",
    gu: "whether-or-not",
    ie: "yeah",
    ja: "and/or",
    "je'a": "indeed",
    je: "and",
    "je,nai": "and-not",
    ju: "whether-or-not",
    "ka'e": "possibly-can",
    ka: "being",
    klama: "come(s)",
    "klama@n": "comer",
    ko: "do-it-so-that-you",
    ku: (array, index) => {
        array[index - 1] = { ...array[index - 1], processedWord: (array[index - 1].processedWord || array[index - 1].word) + "," };
        return array;
    },
    la: (array, index) => {
        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        array[index] = { ...array[index], processedWord: '📛' };
        array[index + 1] = { ...array[index + 1], processedWord: capitalize(array[index + 1].processedWord || array[index + 1].word) };
        return array;
    },
    le: "the",
    lo: "those-which",
    ma: "what",
    me: "among",
    mi: "me",
    mlatu: "is-a-cat",
    "mlatu@n": "cat",
    mo: "is-what",
    "na'e": "not",
    na: "not",
    nai: "-not",
    nelci: "fond-of",
    noi: (array, index) => {
        array[index - 1] = { ...array[index - 1], processedWord: (array[index - 1].processedWord || array[index - 1].word) + ", which" };
        return array;
    },
    poi: (array, index) => {
        array[index - 1] = { ...array[index - 1], processedWord: (array[index - 1].processedWord || array[index - 1].word) + " that" };
        return array;
    },
    nu: "event-of",
    oi: "ouch",
    "pa'o": "through",
    "pe'i": "in-my-opinion",
    pe: "that-is-related-to",
    pei: "?",
    pu: "in-past",
    ra: "recently-mentioned",
    "re'u": "time",
    ro: "each-of",
    roi: "times",
    slabu: "is-familiar-to",
    "tu'a": "about",
    "u'u": "sorry",
    u: "whether-or-not",
    ui: "yay",
    "ui,nai": "unfortunately",
    vau: (array, index) => {
        array[index - 1] = { ...array[index - 1], processedWord: (array[index - 1].processedWord || array[index - 1].word) + "]" };
        return array;
    },
    xu: "is-it-true-that",
    "xu,nai": "isnt-it-so-that",
    "za'a": "as-I-can-see",
    "za'a,dai": "as-you-can-see",
    "zo'u": ":",
    zo: "the-word:",
    //["bakni","is-a-cow"],
};
const universalItems = {
    "ba'e": "NB! =>",
    bo: "><",
    zei: "><",
    cai: "!!!",
    cu: ":",
    da: "X",
    de: "Y",
    di: "Z",
    "fa'o": "∎",
    fa: "¹",
    fe: "²",
    fi: "³",
    fo: "⁴",
    fu: "⁵",
    i: "§",
    jo: "⇔",
    "li'u": "”",
    lu: "“",
    "na'e": "!",
    na: "!",
    "ni'o": "¶",
    si: "✎",
    sa: "✎",
    su: "✎",
    sai: "!",
    se: "1⇔2",
    te: "1⇔3",
    ve: "1⇔4",
    xe: "1⇔5",
};
function jsonDocDirection(jsonDoc) {
    return jsonDoc.dictionary.direction[0] || jsonDoc.dictionary.direction;
}
function fastParse({ doc, bangu }) {
    bangu = bangu !== null && bangu !== void 0 ? bangu : "en";
    if (doc)
        return doc;
    try {
        return require('../assets/dumps/en.json');
    }
    catch (err) { }
    return require('../../dist/assets/dumps/en.json');
}
exports.fastParse = fastParse;
function gloss(te_gerna, bangu = "en", gentufa, jsonDoc) {
    te_gerna = te_gerna.replace(/\"/g, "");
    jsonDoc = fastParse({ doc: jsonDoc, bangu });
    if (gentufa) {
        const parsed = gentufa(te_gerna, " ", true);
        if (parsed.tcini !== "snada")
            return ["di'u na gendra"];
        te_gerna = parsed["kampu"]
            .replace(/,/g, " ")
            .replace(/[^a-z'\. ]/g, "")
            .replace(/ {2,}/gm, " ")
            .trim();
    }
    const arr_te_gerna = te_gerna.split(" ");
    let target = arr_te_gerna.slice();
    let lItems = [];
    if (bangu === "en")
        Object.keys(items).forEach((i) => {
            lItems.push([i.split(","), items[i]]);
        });
    Object.keys(universalItems).forEach((i) => {
        if (lItems.filter(([key]) => key.join(",") == i).length === 0)
            lItems.push([i.split(","), universalItems[i]]);
    });
    let targetProcessed = target.map(i => ({ processed: false, word: i }));
    const lItemsVersions = [{ type: 'string', value: lItems.filter(([, value]) => typeof value === 'string') }, { type: 'function', value: lItems.filter(([, value]) => value instanceof Function) }];
    for (const lItemsSubSet of lItemsVersions) {
        for (let j = 0; j < target.length; j++) {
            const word = target[j];
            const match = lItemsSubSet.value
                .filter(([key]) => (JSON.stringify(target.slice(j, j + key.length)) === JSON.stringify(key)))
                .sort((a, b) => (a[0].length >= b[0].length) ? -1 : -1)[0];
            if (match) {
                const [key, value] = match;
                if (value instanceof Function) {
                    targetProcessed = value(targetProcessed, j);
                }
                else
                    targetProcessed[j] = { ...targetProcessed[j], processed: true, processedWord: value };
                for (let j_ = j + 1; j_ <= j + key.length - 1; j_++) {
                    targetProcessed[j_] = { ...targetProcessed[j_], processed: true, processedWord: null };
                }
                j += key.length - 1;
                continue;
            }
            if (lItemsSubSet.type === 'string') {
                let glossWord;
                const valsi = jsonDocDirection(jsonDoc).valsi.filter((v) => v.word === word);
                if (valsi[0]) {
                    const v = valsi[0];
                    glossWord =
                        R.path(["glossword", "word"], v) ||
                            R.path(["glossword", 0, "word"], v) ||
                            R.path(["keyword", "word"], v);
                    if (!glossWord && v.keyword && Array.isArray(v.keyword)) {
                        const c = v.keyword.filter((k) => k.word === word && k.place === "1");
                        if (c[0])
                            glossWord = c[0].word;
                    }
                }
                if (glossWord) {
                    targetProcessed[j] = { ...targetProcessed[j], processed: true, processedWord: glossWord };
                }
                else {
                    //now try if it's lujvo
                    const selrafsi = (0, sozysozbot_jvozba_1.jvokaha_gui)(word);
                    if (selrafsi.length >= 2) {
                        const lujvo_gloss = gloss(selrafsi.join(" "), bangu, gentufa, jsonDoc);
                        targetProcessed[j] = { ...targetProcessed[j], processed: true, processedWord: lujvo_gloss.join("-") };
                    }
                }
            }
        }
    }
    //deal with non-processed elements
    const prettifiedTarget = targetProcessed.filter(elem => elem.processedWord !== null).map(elem => {
        if (!elem.processed)
            elem.processedWord = elem.word + "*";
        return elem.processedWord;
    });
    return prettifiedTarget;
}
exports.gloss = gloss;
const galfi = (response, bangu, data, akti) => {
    if (response.statusCode == 200) {
        const rule = /^.*?(\{.*\}).*?$/m;
        data = rule.exec(data)[1] || "";
        data = JSON.parse(data);
        let results = {
            title: "",
            definitions: [],
        };
        let title, content;
        //no results found
        if (!data || !data.query || !data.query.pages || data.query.pages[-1]) {
            akti("");
        }
        for (let page in data.query.pages) {
            title = data.query.pages[page].title;
            content = data.query.pages[page].revisions[0]["*"];
        }
        results.title = title;
        let text = content.split("\n");
        const heading1Regex = /^(==)([\w\s]+)(==)$/g;
        const heading2Regex = /^(===)([\w\s]+)(===)$/g;
        const heading3Regex = /^(====)([\w\s]+)(====)$/g;
        const linkRegex = /(\[{2,})([\w\s-]+)(\]{2,})/g;
        const type2LinkRegex = /(\[+)(\w+)([#|\w]+)(\]+)/g;
        const wikipediaArticleRegex = /(\[+)(:?w:)([\w\s]+?)\|([\w\s]+?)(\]+)/g;
        const formalizedTextRegex = /{{l\|[\w\W]+?\|([\w\W]+?)}}/g;
        const formalizedTextRegex2 = /{{[^\|]+?\|([^\|\}]+?)}}/g;
        const contextDataRegex = /(\[{2,})([\w\W]+?)(\]{2,})|({+)([\w\W]+?)(}+)/g;
        const terbricmi = /({{sumti)\|([\w\W]+?)(}})/g;
        const startingAndTrailingCommasRegex = /(^, )|(,$)/g;
        const italicsRegex = /''/g;
        const wordCharactersRegex = /\w/g;
        let heading1, heading2, heading3;
        const normalizeWikidata = (text) => {
            return text
                .replace(linkRegex, "$2") //remove links to other words from definitions;
                .replace(type2LinkRegex, "$2") //replace links of the form [[information|Information]]
                .replace(wikipediaArticleRegex, "$4") //replace links to wikipedia articles with the link text
                .replace(formalizedTextRegex, "$1") //strip formatting from formalized text
                .replace(formalizedTextRegex2, "$1") //strip formatting from formalized text
                .replace(terbricmi, "x$2") //show places of terbricmi as intended
                .replace(contextDataRegex, ""); //get rid of any extra data that is not human-readiable
        };
        text.forEach((line) => {
            //update the current heading if needed
            if (heading1Regex.test(line))
                heading1 = line.replace(heading1Regex, "$2");
            if (heading2Regex.test(line))
                heading2 = line.replace(heading2Regex, "$2");
            if (heading3Regex.test(line))
                heading3 = line.replace(heading3Regex, "$2");
            //handle a definition the line contains one
            if (line.indexOf("# ") === 0 && heading1 == bangu) {
                let newDefinition = line.replace("# ", "");
                newDefinition = normalizeWikidata(newDefinition)
                    .replace(startingAndTrailingCommasRegex, "") //remove starting and trailing commas that might occur (since some extra data that is removed occurs at the beginning and ends of definitions)
                    .replace(italicsRegex, "")
                    .trim();
                if (wordCharactersRegex.test(newDefinition)) {
                    //makes sure there is actually a definition
                    let heading = heading2;
                    //sometimes, the word type will actually be in heading 3. If the heading 2 looks like it isn't a part of speech, use heading 3 instead.
                    if (heading.toLowerCase().indexOf("etymology") != -1 ||
                        heading.toLowerCase().indexOf("pronounciation") != -1) {
                        heading = heading3;
                    }
                    results.definitions.push({
                        meaning: newDefinition,
                        type: heading,
                    });
                }
            }
        });
        if (!results.definitions || results.definitions.length === 0) {
            akti("");
        }
        else {
            let acc = results.title + "\n";
            for (let i = 0; i < results.definitions.length; i++) {
                acc +=
                    results.definitions[i].type +
                        ": " +
                        results.definitions[i].meaning +
                        "\n";
            }
            akti(acc);
        }
    }
};
const wiktionary = (te_gerna, vefanva, akti) => {
    const urli = "https://en.wiktionary.org/w/api.php?format=json&action=query&titles={valsi}&rvprop=content&prop=revisions&redirects=1&callback=?".replace("{valsi}", (0, querystring_1.escape)(te_gerna));
    const encoding = "utf8";
    axios_1.default.get(urli).then((sespusku) => {
        galfi(sespusku, vefanva, encoding ? sespusku.body.toString(encoding) : sespusku.body, akti);
    });
};
exports.wiktionary = wiktionary;
const word = ({ word, jsonDoc, bangu, }) => {
    bangu = bangu !== null && bangu !== void 0 ? bangu : "en";
    jsonDoc = fastParse({ doc: jsonDoc, bangu });
    const words = jsonDocDirection(jsonDoc).valsi.filter((v) => v.word === word);
    return words;
};
exports.word = word;
const selmaho = ({ word, jsonDoc, bangu, }) => {
    bangu = bangu !== null && bangu !== void 0 ? bangu : "en";
    jsonDoc = fastParse({ doc: jsonDoc, bangu });
    word = word.toLowerCase();
    const r = { full: [], partial: [], CLL: null };
    const words = jsonDocDirection(jsonDoc).valsi.filter((v) => {
        if (v.selmaho) {
            if (v.selmaho.toLowerCase() === word)
                r.full.push(v.word);
            else if (v.selmaho.toLowerCase().search(new RegExp(`${word}[\\d]+`)) === 0)
                r.partial.push(v.word);
        }
    });
    const cllarr = cll_1.cllk[word];
    if (cllarr)
        r.CLL = cllarr;
    return r;
};
exports.selmaho = selmaho;
const rafsi = (word, jsonDoc, xugismu, bangu) => {
    bangu = bangu || "en";
    jsonDoc = fastParse({ doc: jsonDoc, bangu });
    let rafsi = [];
    let selrafsi = [];
    const valsi = jsonDocDirection(jsonDoc).valsi;
    for (const v of valsi) {
        if (v.word === word) {
            if (v.rafsi) {
                if (Array.isArray(v.rafsi)) {
                    rafsi = rafsi.concat(v.rafsi);
                }
                else {
                    rafsi.push(v.rafsi);
                }
            }
            const match = (v.notes || "").match(/^.*? -([a-z']+)-.*/);
            if (match && match[1])
                rafsi.push(match[1]);
            if (v.type && v.type.indexOf("fuhivla") >= 0)
                rafsi.push(v.word + "'y");
        }
        if (v.rafsi) {
            if ((Array.isArray(v.rafsi) && v.rafsi.includes(word)) ||
                v.rafsi === word) {
                selrafsi.push(v.word);
            }
        }
        else if ((v.notes || "").search(new RegExp(`^.*? -(${word})-.*`)) >= 0)
            selrafsi.push(v.word);
    }
    if (word.substr(0, 4) !== "brod" && xugismu(word)) {
        rafsi.push(word.substr(0, 4));
    }
    return { rafsi, selrafsi };
};
exports.rafsi = rafsi;
const rafsi_giho_nai_se_rafsi = (word, jsonDoc, xugismu, bangu) => {
    return {
        valsi: word,
        ...(0, exports.rafsi)(word, jsonDoc, xugismu, bangu),
    };
};
exports.rafsi_giho_nai_se_rafsi = rafsi_giho_nai_se_rafsi;
