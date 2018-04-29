const items = [
    ["lo", "those-which"],
    ["le", "the"],
    ["la", "@@@"],
    ["nu", "event-of"],
    ["zo", "the-word:"],
    ["coi", "hello"],
    ["co'o", "goodbye"],
    ["ro", "each-of"],
    ["ma", "what"],
    ["mo", "is-what"],
    ["na", "not"],
    ["na'e", "not"],
    ["nai", "-not"],
    ["nelci", "fond-of"],
    ["ka", "being"],
    ["tu'a", "about"],
    ["ie", "yeah"],
    ["e'u", "I-suggest"],
    ["e'a", "[permission-granted]"],
    ["pei", "?"],
    ["e", "and"],
    ["enai", "and-not"],
    ["a", "and/or"],
    ["jenai", "and-not"],
    ["je", "and"],
    ["ja", "and/or"],
    ["gi'e", ",-and"],
    ["gi'a", ",-and/or"],
    ["bu'u", "at"],
    ["ca", "at-present"],
    ["ku", ","],
    ["zo'u", ":"],
    ["pe", "that-is-related-to"],
    ["za'a", "as-I-can-see"],
    ["za'adai", "as-you-can-see"],
    ["pu", "in-past"],
    ["ba", "in-future"],
    ["vau", "]"],
    ["doi", "oh"],
    ["uinai", "unfortunately"],
    ["u'u", "sorry"],
    ["ko", "do-it-so-that-you"],
    ["poi", "that"],
    ["noi", ",which"],
    ["me", "among"],
    ["ra", "recently-mentioned"],
    //["bakni","is-a-cow"],
    ["mlatu@n", "cat"],
    ["dansu@n", "dancer(s)"],
    ["klama@n", "comer"],
    ["slabu", "is-familiar-to"],
    ["dansu", "dance(s)"],
    ["mlatu", "is-a-cat"],
    ["klama", "come(s)"],
    ["pe'i", "in-my-opinion"],
    ["ui", "yay"],
    ["uinai", "unfortunately"],
    ["ju", "whether-or-not"],
    ["gu", "whether-or-not"],
    ["gi'u", "whether-or-not"],
    ["u", "whether-or-not"],
    ["xu", "is-it-true-that"],
    ["xunai", "isnt-it-so-that"],
    ["ka'e", "possibly-can"],
    ["re'u", "time"],
    ["roi", "times"],
    ["pa'o", "through"],
    ["co'a", "become"],
    ["mi", "me"] //dont copy
];
const universal_items = [ //universal glosses
    ["lu", "<"],
    ["li'u", ">"],
    ["i", "."],
    ["bo", "-|-"],
    ["sai", "!"],
    ["cai", "!!!"],
    ["na'e", "!"],
    ["da", "X"],
    ["de", "Y"],
    ["di", "Z"],
    ["cu", ":"],
    ["jo", "⇔"],
    ["fa", "(1:)"],
    ["fe", "(2:)"],
    ["fi", "(3:)"],
    ["fo", "(4:)"],
    ["fu", "(5:)"],
    ["se", "1⇔2"],
    ["te", "1⇔3"],
    ["ve", "1⇔4"],
    ["xe", "1⇔5"],
    ["ba'e", "(NB!=>)"],
    ["na", "!"]
];

const getxmlDoc = (xmlDoc,bangu) => {
  const fs = require("fs");
  const path = require("path-extra");
  const libxmljs = require("libxmljs");
    return xmlDoc? xmlDoc : libxmljs.parseXml(fs.readFileSync(path.join(__dirname, "../dumps", `${bangu?bangu:'en'}.xml`), {
        encoding: 'utf8'
    }));
}

const gloss = (te_gerna, bangu, gentufa, xmlDoc) => {
    const libxmljs = require("libxmljs");
    te_gerna = te_gerna
      .replace(/\"/g, '')
      .toLowerCase()
      .replace(/[^a-z'\. ]/g, '');
    xmlDoc = getxmlDoc(xmlDoc,bangu);
    let i, myregexp, j;
    if (gentufa) {
        te_gerna = gentufa(te_gerna, "J")["te spuda"]
        .replace(/,/g,' ')
        .replace(/[^a-z'\. ]/g, '')
        .replace(/ ([nd]ai)( |$)/img, "$1$2")
        .trim();
    }
    if (!bangu) bangu="en";
    te_gerna = te_gerna
      .split(" ")
      .map(a => [a, "", false])
      .map(a => {
            if (bangu === 'en') { //items are only for English. Think of some universal items.
                for (let j = 0; j < items.length; j++) {
                    if (a[0] === items[j][0]) {
                        return [a[0], items[j][1], true];
                    }
                }
            }
            if (!a[2]) {
                for (let j = 0; j < universal_items.length; j++) {
                    if (a[0] === universal_items[j][0]) {
                        return [a[0], universal_items[j][1], true];
                    }
                }
            }
            if (!a[2]) {
                let cnt = xmlDoc.get(`/dictionary/direction[1]/valsi[translate(@word,"${a[0].toUpperCase()}","${a[0]}")="${a[0]}"]/glossword[1]`);
                if (!cnt) {
                    cnt = xmlDoc.get(`/dictionary/direction[1]/valsi[translate(@word,"${a[0].toUpperCase()}","${a[0]}")="${a[0]}"]/keyword[@place="1"]`);
                }
                if (cnt) {
                    return [a[0], cnt.attr("word").value(), true];
                } else {
                    return [a[0], "*" + a[0], true];
                }
            }
        });
  return te_gerna.map(a=>a[1]);
}

const zmifanva = (te_gerna, fanva, akti) => {
  const behe = require('then-request');
  const urli = `http://lojban.lilyx.net/zmifanva/?src=${te_gerna}&dir=${fanva}`;
  behe('GET', urli).then(se_spusku => {
    if (se_spusku.statusCode === 200) {
      const re = /<textarea rows=\"8\" cols=\"40\">(.*?)<\/textarea>/;
      const match = re.exec(se_spusku.body.toString('utf8').replace(/\n/g, ""));
      akti(match[1] || "O_0");
    }
  });
};

const galfi = (response, bangu, data, akti) => {
  if (response.statusCode == 200) {
    const rule = /^.*?(\{.*\}).*?$/m;
    data = rule.exec(data)[1]||'';
    data = JSON.parse(data);
    let results = {
      title: "",
      definitions: []
    }

    let title, content;

    //no results found

    if(!data || !data.query || !data.query.pages || data.query.pages[-1]) {
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
    }

    text.forEach(line => {
      //update the current heading if needed
      if (heading1Regex.test(line)) heading1 = line.replace(heading1Regex, "$2");
      if (heading2Regex.test(line)) heading2 = line.replace(heading2Regex, "$2");
      if(heading3Regex.test(line)) heading3 = line.replace(heading3Regex, "$2");
      //handle a definition the line contains one

      if (line.indexOf("# ") === 0 && heading1 == bangu) {
        let newDefinition = line.replace("# ", "");
        newDefinition = normalizeWikidata(newDefinition)
          .replace(startingAndTrailingCommasRegex, "") //remove starting and trailing commas that might occur (since some extra data that is removed occurs at the beginning and ends of definitions)
          .replace(italicsRegex, "").trim();

        if (wordCharactersRegex.test(newDefinition)) { //makes sure there is actually a definition
          let heading = heading2;
          //sometimes, the word type will actually be in heading 3. If the heading 2 looks like it isn't a part of speech, use heading 3 instead.
          if(heading.toLowerCase().indexOf("etymology") != -1 ||
            heading.toLowerCase().indexOf("pronounciation") != -1) {
            heading = heading3;
          }
          results.definitions.push({
            meaning: newDefinition,
            type: heading
          });
        }
      }
    });

    if(!results.definitions||(results.definitions.length===0)) {
      akti("");
    }
    else {
      let acc=results.title+'\n';
      for (let i = 0; i < results.definitions.length; i++) {
        acc += results.definitions[i].type + ": " + results.definitions[i].meaning+'\n';
      }
      akti(acc);
    }
  }
}

const wiktionary = (te_gerna, bangu, akti) => {
  const urli = "https://en.wiktionary.org/w/api.php?format=json&action=query&titles={valsi}&rvprop=content&prop=revisions&redirects=1&callback=?".replace("{valsi}", require('querystring').escape(te_gerna));
  const options = {
    headers: {
      'User-Agent': 'then-request'
    }
  };
  const encoding = 'utf8';
  require('then-request')('GET', urli, options)
  .then(function (se_spusku) {
    galfi(se_spusku, bangu, encoding? se_spusku.body.toString(encoding) : se_spusku.body, akti);
  });
}

const ma_selrafsi = (lin,xmlDoc) => {
  xmlDoc = getxmlDoc(xmlDoc,"en");
  let rev = xmlDoc.get(`/dictionary/direction[1]/valsi[rafsi="${lin}"]`);
  //now try -raf- in notes
  if (!rev) rev = xmlDoc.get(`/dictionary/direction[1]/valsi[contains(translate(./notes,"${lin.toUpperCase()}","${lin}")," -${lin}-")]`);
  //now try to add a vowel:
  if (!rev) rev = xmlDoc.get(`/dictionary/direction[1]/valsi[@word="${lin}a" and (@type="fu'ivla" or @type="experimental gismu" or @type="gismu")]`);
  if (!rev) rev = xmlDoc.get(`/dictionary/direction[1]/valsi[@word="${lin}e" and (@type="fu'ivla" or @type="experimental gismu" or @type="gismu")]`);
  if (!rev) rev = xmlDoc.get(`/dictionary/direction[1]/valsi[@word="${lin}i" and (@type="fu'ivla" or @type="experimental gismu" or @type="gismu")]`);
  if (!rev) rev = xmlDoc.get(`/dictionary/direction[1]/valsi[@word="${lin}o" and (@type="fu'ivla" or @type="experimental gismu" or @type="gismu")]`);
  if (!rev) rev = xmlDoc.get(`/dictionary/direction[1]/valsi[@word="${lin}u" and (@type="fu'ivla" or @type="experimental gismu" or @type="gismu")]`);
  return rev;
};

const ma_rafsi = (lin,xmlDoc,xugismu) => {
  xmlDoc = getxmlDoc(xmlDoc,"en");
  let coun = xmlDoc.find(`/dictionary/direction[1]/valsi[translate(@word,"${lin.toUpperCase()}","${lin}")="${lin}"]/rafsi/text()[1]`).map(a=>{return a.text();}); //official
  try {
    const s = xmlDoc.get(`/dictionary/direction[1]/valsi[translate(@word,"${lin.toUpperCase()}","${lin}")="${lin}"]/notes[1]`).text();
    const tmp = s.replace(/^.*? -([a-z']+)-.*/, '$1');
    if (tmp !== s) {
      coun.push(tmp);
    }
  } catch (err) {} //search in notes

  if (lin.substr(0, 4) !== 'brod' && xugismu(lin)) {
    coun.push(lin.substr(0, 4)+"y");
  } //long rafsi
  return coun;
};

const rafsi_giho_nai_se_rafsi_gui = (lin,xmlDoc,xugismu) => {
  let a={};
  a.valsi = lin;
  a.rafsi = ma_rafsi(lin,xmlDoc,xugismu);
  const rev = ma_selrafsi(lin,xmlDoc);
  if (rev && rev.attr("word").value() !== lin) {
    a.serafsi = rev.attr("word").value();
  }
  return a;
};

module.exports = {gloss, zmifanva, wiktionary, ma_rafsi, ma_selrafsi, rafsi_giho_nai_se_rafsi_gui};
