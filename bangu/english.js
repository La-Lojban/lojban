const R = require("ramda");
const he = require("he");
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
  enai: "and-not",
  "gi'a": ",-and/or",
  "gi'e": ",-and",
  "gi'u": "whether-or-not",
  gu: "whether-or-not",
  ie: "yeah",
  ja: "and/or",
  "je'a": "indeed",
  je: "and",
  jenai: "and-not",
  ju: "whether-or-not",
  "ka'e": "possibly-can",
  ka: "being",
  klama: "come(s)",
  "klama@n": "comer",
  ko: "do-it-so-that-you",
  ku: (array, index) => {
    array[index - 1] = array[index - 1] + ",";
    return array;
  },
  la: (array, index) => {
    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
    array[index + 1] = capitalize(array[index + 1]);
    return array;
  },
  le: "the",
  lo: "those-which",
  ma: "what",
  me: "among",
  mi: "me", //dont copy
  mlatu: "is-a-cat",
  "mlatu@n": "cat",
  mo: "is-what",
  "na'e": "not",
  na: "not",
  nai: "-not",
  nelci: "fond-of",
  noi: (array, index) => {
    array[index - 1] = array[index - 1] + ", which";
    return array;
  },
  poi: (array, index) => {
    array[index - 1] = array[index - 1] + " that";
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
  uinai: "unfortunately",
  vau: (array, index) => {
    array[index - 1] = array[index - 1] + "]";
    return array;
  },
  xu: "is-it-true-that",
  xunai: "isnt-it-so-that",
  "za'a": "as-I-can-see",
  "za'adai": "as-you-can-see",
  "zo'u": ":",
  zo: "the-word:"
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
  xe: "1⇔5"
};

function jsonDocDirection(jsonDoc) {
  return jsonDoc.dictionary.direction[0] || jsonDoc.dictionary.direction;
}

function fastParse(jsonDoc, bangu = "en") {
  if (jsonDoc) return jsonDoc;
  const fs = require("fs");
  const path = require("path-extra");
  return require("fast-xml-parser").parse(
    fs
      .readFileSync(path.join(__dirname, "../dumps", `${bangu}.xml`), {
        encoding: "utf8"
      })
      .replace(/(&lt;|<)script.*?(&gt;|>).*?(&lt;|<)/g, "&lt;")
      .replace(/(&lt;|<)\/script(&gt;|>)/g, ""),
    {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      allowBooleanAttributes: false,
      parseNodeValue: false,
      parseAttributeValue: false,
      attrValueProcessor: a => he.decode(a, { isAttributeValue: true }),
      tagValueProcessor: a => he.decode(a)
    }
  );
}

const gloss = (te_gerna, bangu = "en", gentufa, jsonDoc) => {
  te_gerna = te_gerna
    .replace(/\"/g, "");
  jsonDoc = fastParse(jsonDoc, bangu);
  let i, myregexp, j;
  if (gentufa) {
    const parsed = gentufa(te_gerna, ' ', true);
    if (parsed.tcini !== "snada") return ["di'u na gendra"];
    te_gerna = parsed["kampu"]
      .replace(/,/g, " ")
      .replace(/[^a-z'\. ]/g, "")
      .replace(/ {2,}/gm, " ")
      .trim();
  }
  te_gerna = te_gerna.split(" ");

  target = te_gerna.slice();
  const fItems = {};
  const fUniversalItems = {};
  const lItems = {};
  const lUniversalItems = {};
  Object.keys(items).map(i => {
    if (items[i] instanceof Function) {
      fItems[i] = items[i];
    } else {
      lItems[i] = items[i];
    }
  });
  Object.keys(universalItems).map(i => {
    if (universalItems[i] instanceof Function) {
      fUniversalItems[i] = universalItems[i];
    } else {
      lUniversalItems[i] = universalItems[i];
    }
  });

  for (let j in target) {
    const word = target[j];
    if (bangu === "en") {
      const match = R.compose(
        R.take(1),
        R.filter(n => n === word)
      )(Object.keys(lItems));
      if (match[0]) {
        target[j] = lItems[match[0]];
        continue;
      }
    }
    const match = R.compose(
      R.take(1),
      R.filter(n => n === word)
    )(Object.keys(lUniversalItems));
    if (match[0]) {
      target[j] = lUniversalItems[match[0]];
      continue;
    }

    let gloss;
    const valsi = jsonDocDirection(jsonDoc).valsi.filter(v => v.word === word);
    if (valsi[0]) {
      const v = valsi[0];
      gloss =
        R.path(["glossword", "word"], v) ||
        R.path(["glossword", 0, "word"], v) ||
        R.path(["keyword", "word"], v);
      if (!gloss && v.keyword && Array.isArray(v.keyword)) {
        const c = v.keyword.filter(k => k.word === word && k.place === "1");
        if (c[0]) gloss = c[0].word;
      }
    }
    if (!gloss) {
      target[j] = te_gerna[j] + "*";
    } else {
      target[j] = gloss.replace(/ /g, "-");
    }
  }

  //functional
  te_gerna.forEach((word, j) => {
    if (bangu === "en") {
      const match = R.compose(
        R.take(1),
        R.filter(n => n === word)
      )(Object.keys(fItems));
      if (match[0]) {
        target = fItems[match[0]](target, j);
        target[j] = true;
      }
    }
    if (target[j] !== true) {
      const match = R.compose(
        R.take(1),
        R.filter(n => n === word)
      )(Object.keys(fUniversalItems));
      if (match[0]) {
        target = fUniversalItems[match[0]](target, j);
        target[j] = true;
      }
    }
  });

  target = target.filter(j => j !== true);
  return target;
};

const zmifanva = (te_gerna, fanva, akti) => {
  const behe = require("then-request");
  const urli = `http://lojban.lilyx.net/zmifanva/?src=${te_gerna}&dir=${fanva}`;
  behe("GET", urli).then(se_spusku => {
    if (se_spusku.statusCode === 200) {
      const re = /<textarea rows=\"8\" cols=\"40\">(.*?)<\/textarea>/;
      const match = re.exec(se_spusku.body.toString("utf8").replace(/\n/g, ""));
      akti(match[1] || "O_0");
    }
  });
};

const galfi = (response, bangu, data, akti) => {
  if (response.statusCode == 200) {
    const rule = /^.*?(\{.*\}).*?$/m;
    data = rule.exec(data)[1] || "";
    data = JSON.parse(data);
    let results = {
      title: "",
      definitions: []
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

    const normalizeWikidata = text => {
      return text
        .replace(linkRegex, "$2") //remove links to other words from definitions;
        .replace(type2LinkRegex, "$2") //replace links of the form [[information|Information]]
        .replace(wikipediaArticleRegex, "$4") //replace links to wikipedia articles with the link text
        .replace(formalizedTextRegex, "$1") //strip formatting from formalized text
        .replace(formalizedTextRegex2, "$1") //strip formatting from formalized text
        .replace(terbricmi, "x$2") //show places of terbricmi as intended
        .replace(contextDataRegex, ""); //get rid of any extra data that is not human-readiable
    };

    text.forEach(line => {
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
          if (
            heading.toLowerCase().indexOf("etymology") != -1 ||
            heading.toLowerCase().indexOf("pronounciation") != -1
          ) {
            heading = heading3;
          }
          results.definitions.push({
            meaning: newDefinition,
            type: heading
          });
        }
      }
    });

    if (!results.definitions || results.definitions.length === 0) {
      akti("");
    } else {
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

const wiktionary = (te_gerna, bangu, akti) => {
  const urli = "https://en.wiktionary.org/w/api.php?format=json&action=query&titles={valsi}&rvprop=content&prop=revisions&redirects=1&callback=?".replace(
    "{valsi}",
    require("querystring").escape(te_gerna)
  );
  const options = {
    headers: {
      "User-Agent": "then-request"
    }
  };
  const encoding = "utf8";
  require("then-request")("GET", urli, options).then(function(se_spusku) {
    galfi(
      se_spusku,
      bangu,
      encoding ? se_spusku.body.toString(encoding) : se_spusku.body,
      akti
    );
  });
};

const selmaho = ({ word, jsonDoc }) => {
  jsonDoc = fastParse(jsonDoc);
  word = word.toLowerCase();
  let r = { full: [], partial: [] };
  const words = jsonDocDirection(jsonDoc).valsi.filter(v => {
    if (v.selmaho) {
      if (v.selmaho.toLowerCase() === word) r.full.push(v.word);
      else if (
        v.selmaho.toLowerCase().search(new RegExp(`${word}[\\d]+`)) === 0
      )
        r.partial.push(v.word);
    }
  });
  const cll = require("./cll.js");
  const cllarr = cll.cllk()[word];
  if (cllarr) r.CLL = cllarr;
  return r;
};

const rafsi = (word, jsonDoc, xugismu) => {
  jsonDoc = fastParse(jsonDoc);
  let rafsi = [];
  let selrafsi = [];
  const valsi = jsonDocDirection(jsonDoc).valsi;
  for (const v of valsi) {
    if (v.word === word) {
      if (v.rafsi) {
        if (Array.isArray(v.rafsi)) {
          rafsi = rafsi.concat(v.rafsi);
        } else {
          rafsi.push(v.rafsi);
        }
      }
      const match = (v.notes || "").match(/^.*? -([a-z']+)-.*/);
      if (match && match[1]) rafsi.push(match[1]);
      if (v.type && v.type.indexOf("fuhivla") >= 0) rafsi.push(v.word + "'y");
    }
    if (v.rafsi) {
      if (
        (Array.isArray(v.rafsi) && v.rafsi.includes(word)) ||
        v.rafsi === word
      ) {
        selrafsi.push(v.word);
      }
    } else if ((v.notes || "").search(new RegExp(`^.*? -(${word})-.*`)) >= 0)
      selrafsi.push(v.word);
  }
  if (word.substr(0, 4) !== "brod" && xugismu(word)) {
    rafsi.push(word.substr(0, 4));
  }
  return { rafsi, selrafsi };
};

const rafsi_giho_nai_se_rafsi = (word, jsonDoc, xugismu) => {
  return {
    valsi: word,
    ...rafsi(word, jsonDoc, xugismu)
  };
};

module.exports = {
  gloss,
  zmifanva,
  wiktionary,
  selmaho,
  rafsi,
  rafsi_giho_nai_se_rafsi
};
