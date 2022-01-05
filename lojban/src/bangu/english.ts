import * as R from "ramda";
import axios from "axios"
import { escape } from "querystring"
import { cllk } from "./cll"
const items: any = {
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
  ku: (array: string[], index: number) => {
    array[index - 1] = array[index - 1] + ","
    return array
  },
  la: (array: string[], index: number) => {
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
    array[index + 1] = capitalize(array[index + 1])
    return array
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
  noi: (array: string[], index: number) => {
    array[index - 1] = array[index - 1] + ", which"
    return array
  },
  poi: (array: string[], index: number) => {
    array[index - 1] = array[index - 1] + " that"
    return array
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
  vau: (array: string[], index: number) => {
    array[index - 1] = array[index - 1] + "]"
    return array
  },
  xu: "is-it-true-that",
  xunai: "isnt-it-so-that",
  "za'a": "as-I-can-see",
  "za'adai": "as-you-can-see",
  "zo'u": ":",
  zo: "the-word:",
  //["bakni","is-a-cow"],
}

const universalItems: any = {
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
}

function jsonDocDirection(jsonDoc: any) {
  return jsonDoc.dictionary.direction[0] || jsonDoc.dictionary.direction
}

export function fastParse({ doc, bangu }: { doc: any; bangu?: string }) {
  bangu = bangu ?? "en"
  if (doc) return doc
  try {
    return require('../assets/dumps/en.json')
  }catch(err){}
  return require('../../dist/assets/dumps/en.json')
}

export const gloss = (
  te_gerna: string,
  bangu = "en",
  gentufa: any,
  jsonDoc: any
) => {
  te_gerna = te_gerna.replace(/\"/g, "")
  jsonDoc = fastParse({ doc: jsonDoc, bangu })
  if (gentufa) {
    const parsed = gentufa(te_gerna, " ", true)
    if (parsed.tcini !== "snada") return ["di'u na gendra"]
    te_gerna = parsed["kampu"]
      .replace(/,/g, " ")
      .replace(/[^a-z'\. ]/g, "")
      .replace(/ {2,}/gm, " ")
      .trim()
  }
  const arr_te_gerna = te_gerna.split(" ")

  let target: Array<string | boolean> = arr_te_gerna.slice()
  const fItems: any = {}
  const fUniversalItems: any = {}
  const lItems: any = {}
  const lUniversalItems: any = {}
  Object.keys(items).map((i: string) => {
    if (items[i] instanceof Function) {
      fItems[i] = items[i]
    } else {
      lItems[i] = items[i]
    }
  })
  Object.keys(universalItems).map((i) => {
    if (universalItems[i] instanceof Function) {
      fUniversalItems[i] = universalItems[i]
    } else {
      lUniversalItems[i] = universalItems[i]
    }
  })

  for (let j in target) {
    const word = target[j]
    if (bangu === "en") {
      const match = Object.keys(lItems).filter((n) => n === word)[0]

      if (match) {
        target[j] = lItems[match]
        continue
      }
    }
    const match = Object.keys(lUniversalItems).filter((n) => n === word)[0]

    if (match) {
      target[j] = lUniversalItems[match]
      continue
    }

    let gloss
    const valsi = jsonDocDirection(jsonDoc).valsi.filter(
      (v: { word: string | boolean }) => v.word === word
    )
    if (valsi[0]) {
      const v = valsi[0]
      gloss =
        R.path(["glossword", "word"], v) ||
        R.path(["glossword", 0, "word"], v) ||
        R.path(["keyword", "word"], v)
      if (!gloss && v.keyword && Array.isArray(v.keyword)) {
        const c = v.keyword.filter(
          (k: { word: string | boolean; place: string }) =>
            k.word === word && k.place === "1"
        )
        if (c[0]) gloss = c[0].word
      }
    }
    if (!gloss) {
      target[j] = te_gerna[j] + "*"
    } else {
      target[j] = gloss.replace(/ /g, "-")
    }
  }

  //functional
  arr_te_gerna.forEach((word: string, j: number) => {
    if (bangu === "en") {
      const match = Object.keys(fItems).filter((n) => n === word)[0]
      if (match) {
        target = fItems[match](target, j)
        target[j] = true
      }
    }
    if (target[j] !== true) {
      const match = Object.keys(fUniversalItems).filter((n) => n === word)[0]
      if (match) {
        target = fUniversalItems[match](target, j)
        target[j] = true
      }
    }
  })

  target = target.filter((j) => j !== true)
  return target
}

const galfi = (response: any, bangu: string, data: any, akti: Function) => {
  if (response.statusCode == 200) {
    const rule = /^.*?(\{.*\}).*?$/m
    data = rule.exec(data)[1] || ""
    data = JSON.parse(data)
    let results: any = {
      title: "",
      definitions: [],
    }

    let title, content

    //no results found

    if (!data || !data.query || !data.query.pages || data.query.pages[-1]) {
      akti("")
    }

    for (let page in data.query.pages) {
      title = data.query.pages[page].title
      content = data.query.pages[page].revisions[0]["*"]
    }

    results.title = title

    let text = content.split("\n")

    const heading1Regex = /^(==)([\w\s]+)(==)$/g
    const heading2Regex = /^(===)([\w\s]+)(===)$/g
    const heading3Regex = /^(====)([\w\s]+)(====)$/g
    const linkRegex = /(\[{2,})([\w\s-]+)(\]{2,})/g
    const type2LinkRegex = /(\[+)(\w+)([#|\w]+)(\]+)/g
    const wikipediaArticleRegex = /(\[+)(:?w:)([\w\s]+?)\|([\w\s]+?)(\]+)/g
    const formalizedTextRegex = /{{l\|[\w\W]+?\|([\w\W]+?)}}/g
    const formalizedTextRegex2 = /{{[^\|]+?\|([^\|\}]+?)}}/g
    const contextDataRegex = /(\[{2,})([\w\W]+?)(\]{2,})|({+)([\w\W]+?)(}+)/g
    const terbricmi = /({{sumti)\|([\w\W]+?)(}})/g
    const startingAndTrailingCommasRegex = /(^, )|(,$)/g
    const italicsRegex = /''/g
    const wordCharactersRegex = /\w/g

    let heading1: string, heading2: string, heading3: string

    const normalizeWikidata = (text: string) => {
      return text
        .replace(linkRegex, "$2") //remove links to other words from definitions;
        .replace(type2LinkRegex, "$2") //replace links of the form [[information|Information]]
        .replace(wikipediaArticleRegex, "$4") //replace links to wikipedia articles with the link text
        .replace(formalizedTextRegex, "$1") //strip formatting from formalized text
        .replace(formalizedTextRegex2, "$1") //strip formatting from formalized text
        .replace(terbricmi, "x$2") //show places of terbricmi as intended
        .replace(contextDataRegex, "") //get rid of any extra data that is not human-readiable
    }

    text.forEach((line: string) => {
      //update the current heading if needed
      if (heading1Regex.test(line)) heading1 = line.replace(heading1Regex, "$2")
      if (heading2Regex.test(line)) heading2 = line.replace(heading2Regex, "$2")
      if (heading3Regex.test(line)) heading3 = line.replace(heading3Regex, "$2")
      //handle a definition the line contains one

      if (line.indexOf("# ") === 0 && heading1 == bangu) {
        let newDefinition = line.replace("# ", "")
        newDefinition = normalizeWikidata(newDefinition)
          .replace(startingAndTrailingCommasRegex, "") //remove starting and trailing commas that might occur (since some extra data that is removed occurs at the beginning and ends of definitions)
          .replace(italicsRegex, "")
          .trim()

        if (wordCharactersRegex.test(newDefinition)) {
          //makes sure there is actually a definition
          let heading = heading2
          //sometimes, the word type will actually be in heading 3. If the heading 2 looks like it isn't a part of speech, use heading 3 instead.
          if (
            heading.toLowerCase().indexOf("etymology") != -1 ||
            heading.toLowerCase().indexOf("pronounciation") != -1
          ) {
            heading = heading3
          }
          results.definitions.push({
            meaning: newDefinition,
            type: heading,
          })
        }
      }
    })

    if (!results.definitions || results.definitions.length === 0) {
      akti("")
    } else {
      let acc = results.title + "\n"
      for (let i = 0; i < results.definitions.length; i++) {
        acc +=
          results.definitions[i].type +
          ": " +
          results.definitions[i].meaning +
          "\n"
      }
      akti(acc)
    }
  }
}

export const wiktionary = (
  te_gerna: string,
  vefanva: string,
  akti: Function
) => {
  const urli = "https://en.wiktionary.org/w/api.php?format=json&action=query&titles={valsi}&rvprop=content&prop=revisions&redirects=1&callback=?".replace(
    "{valsi}",
    escape(te_gerna)
  )
  const encoding = "utf8"
  axios.get(urli).then((sespusku: any) => {
    galfi(
      sespusku,
      vefanva,
      encoding ? sespusku.body.toString(encoding) : sespusku.body,
      akti
    )
  })
}
export const word = ({
  word,
  jsonDoc,
  bangu,
}: {
  word: string
  jsonDoc: any
  bangu?: string
}) => {
  bangu = bangu ?? "en"
  jsonDoc = fastParse({ doc: jsonDoc, bangu })
  const words = jsonDocDirection(jsonDoc).valsi.filter(
    (v: { word: string }) => v.word === word
  )
  return words
}

export const selmaho = ({
  word,
  jsonDoc,
  bangu,
}: {
  word: string
  jsonDoc: any
  bangu: string
}) => {
  bangu = bangu ?? "en"
  jsonDoc = fastParse({ doc: jsonDoc, bangu })
  word = word.toLowerCase()
  const r: any = { full: [], partial: [], CLL: null }
  const words = jsonDocDirection(jsonDoc).valsi.filter(
    (v: { selmaho: string; word: string }) => {
      if (v.selmaho) {
        if (v.selmaho.toLowerCase() === word) r.full.push(v.word)
        else if (
          v.selmaho.toLowerCase().search(new RegExp(`${word}[\\d]+`)) === 0
        )
          r.partial.push(v.word)
      }
    }
  )
  const cllarr = cllk[word]
  if (cllarr) r.CLL = cllarr
  return r
}

export const rafsi = (
  word: string,
  jsonDoc: any,
  xugismu: (arg0: any) => any,
  bangu: string
) => {
  bangu = bangu || "en"
  jsonDoc = fastParse({ doc: jsonDoc, bangu })
  let rafsi: string[] = []
  let selrafsi = []
  const valsi = jsonDocDirection(jsonDoc).valsi
  for (const v of valsi) {
    if (v.word === word) {
      if (v.rafsi) {
        if (Array.isArray(v.rafsi)) {
          rafsi = rafsi.concat(v.rafsi)
        } else {
          rafsi.push(v.rafsi)
        }
      }
      const match = (v.notes || "").match(/^.*? -([a-z']+)-.*/)
      if (match && match[1]) rafsi.push(match[1])
      if (v.type && v.type.indexOf("fuhivla") >= 0) rafsi.push(v.word + "'y")
    }
    if (v.rafsi) {
      if (
        (Array.isArray(v.rafsi) && v.rafsi.includes(word)) ||
        v.rafsi === word
      ) {
        selrafsi.push(v.word)
      }
    } else if ((v.notes || "").search(new RegExp(`^.*? -(${word})-.*`)) >= 0)
      selrafsi.push(v.word)
  }
  if (word.substr(0, 4) !== "brod" && xugismu(word)) {
    rafsi.push(word.substr(0, 4))
  }
  return { rafsi, selrafsi }
}

export const rafsi_giho_nai_se_rafsi = (
  word: string,
  jsonDoc: any,
  xugismu: any,
  bangu?: string
) => {
  return {
    valsi: word,
    ...rafsi(word, jsonDoc, xugismu, bangu),
  }
}
