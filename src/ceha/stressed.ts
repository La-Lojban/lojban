interface LetterMapping {
  [key: string]: string;
}

const krulermorna = (text: string): string => {
  text = text.replace(/\./g, "");
  text = text.replace(/^/, ".");
  text = text.replace(/u([aeiouy])/g, "w$1");
  text = text.replace(/i([aeiouy])/g, "ɩ$1");
  text = text.replace(/au/g, "ḁ");
  text = text.replace(/ai/g, "ą");
  text = text.replace(/ei/g, "ę");
  text = text.replace(/oi/g, "ǫ");
  text = text.replace(/\./g, "");
  return text;
};

const krulermornaize = (words: string[]): string[] => {
  return words.map(krulermorna);
};

const ipaVits: LetterMapping = {
  a$: "aː",
  a: "aː",
  // "e(?=v)": 'ɛːʔ',
  // "e$": 'ɛːʔ',
  e: "ɛː",
  i: "iː",
  o: "oː",
  u: "ʊu",
  // "u": 'ʊː',
  y: "əː",
  ą: "aɪ",
  ę: "ɛɪ",
  // "ę(?=\b)(?!')": 'ɛɪʔ',
  ǫ: "ɔɪ",
  ḁ: "aʊ",
  ɩa: "jaː",
  ɩe: "jɛː",
  ɩi: "jiː",
  ɩo: "jɔː",
  ɩu: "juː",
  ɩy: "jəː",
  ɩ: "j",
  wa: "waː",
  we: "wɛː",
  wi: "wiː",
  wo: "wɔː",
  wu: "wuː",
  wy: "wəː",
  w: "w",
  c: "ʃ",
  // "bj": 'bʒ',
  j: "ʒ",
  s: "s",
  z: "z",
  f: "f",
  v: "v",
  x: "hhh",
  "'": "h",
  // "dj":'dʒ',
  // "tc":'tʃ',
  // "dz":'ʣ',
  // "ts":'ʦ',
  r: "ɹ",
  "r(?![ˈaeiouyḁąęǫ])": "ɹɹ",
  // 'r(?=[ˈaeiouyḁąęǫ])': 'ɹ',
  nˈu: "nˈʊuː",
  nu: "nʊuː",
  ng: "n.g",
  n: "n",
  m: "m",
  l: "l",
  b: "b",
  d: "d",
  g: "ɡ",
  k: "k",
  p: "p",
  t: "t",
  h: "h",
};

const rukMapping: LetterMapping = {
  A: "а́",
  E: "э́",
  I: "и́",
  O: "о́",
  U: "у́",
  a: "а",
  e: "э",
  i: "и",
  o: "о",
  u: "у",
  y: "ы",
  f: "ф",
  v: "в",
  x: "хх",
  s: "с",
  z: "з",
  ci: "щи",
  "tc(?=[aeiou])": "ч",
  "tc(?=[y])": "тш",
  "ts(?=[aeouy])": "ц",
  "ts(?=[i])": "тс",
  c: "ш",
  j: "ж",
  p: "п",
  b: "б",
  t: "т",
  d: "д",
  k: "к",
  g: "г",
  l: "л",
  r: "р",
  m: "м",
  n: "н",
  "'": "h",
  ą: "ай",
  ę: "эй",
  ǫ: "ой",
  ḁ: "аw",
  ɩ: "йː",
  w: "w",
};

const consonantPattern = new RegExp("[bcdfgjklmnprstvxz]");
const upperCaseVowelPattern = new RegExp("[AEIOU]");
const vowelPattern = new RegExp("[aeiouyąęǫḁ]");
const vowelComingPattern = new RegExp("(?=[aeiouyąęǫḁ])");
const diphthongComingPattern = new RegExp("(?=[ąęǫḁ])");

const questionWords = krulermornaize(["ma", "mo", "xu"]);
const starterWords = krulermornaize(["le", "lo", "lei", "loi"]);
const terminatorWords = krulermornaize(["kei", "ku'o", "vau", "li'u"]);

function convertToLowercase(word: string) {
  const vowels = ["a", "e", "i", "o", "u"];
  let result = "";

  for (let i = 0; i < word.length; i++) {
    const c = word[i];
    if (c === undefined) continue;
    const char = c.toLowerCase();
    if (!vowels.includes(char)) {
      result += char;
    } else {
      result += c;
    }
  }

  return result;
}

export const lojban2ipa = (text: string): string => {
  text = krulermorna(text.trim());
  const words = text.split(" ");
  const rebuiltWords: string[] = [];
  for (let index = 0; index < words.length; index++) {
    const wordVal = words[index];
    if (wordVal === undefined) continue;
    let modifiedWord: string = wordVal;
    let prefix = "";
    let postfix = "";

    if (questionWords.includes(modifiedWord)) {
      postfix = "?";
      prefix = " " + prefix;
    }

    if (starterWords.includes(modifiedWord)) {
      prefix = " " + prefix;
    }

    if (terminatorWords.includes(modifiedWord)) {
      postfix = ", ";
    }
    if (index === 0 || modifiedWord === "ni'o" || modifiedWord === "i") {
      prefix = ", " + prefix;
    }

    const splitWord = modifiedWord.split(vowelComingPattern);
    const tailWord = splitWord.slice(-2);
    const t0 = tailWord[0];
    const t1 = tailWord[1];

    // add stress to {lau}, {coi}
    if (
      tailWord.length === 2 &&
      t0 !== undefined && t0.length > 0 &&
      t1 !== undefined &&
      diphthongComingPattern.test(t1.charAt(0))
    ) {
      const headWord = splitWord.slice(0, -2);
      modifiedWord = headWord.join("") + t0 + "ˈ" + t1;
      postfix = postfix + " ";
    }

    // add a pause even after a cmavo
    const prevWord = words[index - 1];
    if (!(index - 1 >= 0 && prevWord !== undefined && starterWords.includes(prevWord))) {
      prefix = " " + prefix;
    }

    let rebuiltWord = "";
    for (let idx = 0; idx < modifiedWord.length; idx++) {
      const tail = modifiedWord.slice(idx);
      let matched = false;
      let consumed = 1;
      for (const [attr, val] of Object.entries(ipaVits).sort(
        (a, b) => b[0].length - a[0].length
      )) {
        const pattern = new RegExp("^" + attr);
        const matches = pattern.exec(tail);
        if (matches) {
          const match = matches[0];
          consumed = match !== undefined ? match.length : 0;
          rebuiltWord += val;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const c = modifiedWord[idx];
        if (c !== undefined) rebuiltWord += c;
      }
      idx += consumed - 1;
    }
    rebuiltWords.push(prefix + rebuiltWord + postfix);
  }
  return rebuiltWords.join(" ");
};

export const lojban2ruk = (text: string): string => {
  text = text
    .trim()
    .replace(/\./g, " ")
    .replace(/ {2,}/g, " ")
    .replace(/\n/g, " \n");
  text = krulermorna(text);
  const words = text.split(" ");
  const rebuiltWords: string[] = [];
  for (let index = 0; index < words.length; index++) {
    const wordVal = words[index];
    if (wordVal === undefined) continue;
    let modifiedWord: string = wordVal;
    let prefix = "";
    let postfix = "";

    // Handle the Lojban word "i"
    if (modifiedWord === "i") {
      modifiedWord = "И";
      if (index !== 0) {
        prefix = ". ";
      }
    }

    if (questionWords.includes(modifiedWord)) {
      postfix = "?";
      prefix = " " + prefix;
    }

    if (starterWords.includes(modifiedWord)) {
      prefix = " " + prefix;
    }

    if (terminatorWords.includes(modifiedWord)) {
      postfix = ", ";
    }

    const splitWord = modifiedWord.split(vowelComingPattern);
    const tailWord = splitWord.slice(-2);
    const t0 = tailWord[0];
    const t1 = tailWord[1];
    const firstChar = modifiedWord.toLowerCase().split("")[0];
    const lastChar = modifiedWord.toLowerCase().split("").slice(-1)[0];
    // dont add stress to cmevla with uppercases
    if (
      firstChar !== undefined && consonantPattern.test(firstChar) &&
      lastChar !== undefined && consonantPattern.test(lastChar) &&
      upperCaseVowelPattern.test(modifiedWord)
    ) {
      modifiedWord = convertToLowercase(modifiedWord);
      postfix = postfix + " ";
    } else if (
      tailWord.length === 2 &&
      t0 !== undefined && t0.length > 0 &&
      t1 !== undefined &&
      vowelPattern.test(t0.charAt(0)) &&
      vowelPattern.test(t1.charAt(0))
    ) {
      const headWord = splitWord.slice(0, -2);
      modifiedWord =
        headWord.join("") +
        t0.charAt(0) +
        "\u0301" +
        t0.split("").slice(1).join("") +
        tailWord.slice(1).join("");
      postfix = postfix + " ";
    }

    // add stress to {lau}, {coi}
    else if (
      tailWord.length === 2 &&
      t0 !== undefined && t0.length > 0 &&
      t1 !== undefined &&
      diphthongComingPattern.test(t1.charAt(0))
    ) {
      const headWord = splitWord.slice(0, -2);

      modifiedWord = headWord.join("") + t0 + t1 + "\u0301";
      postfix = postfix + " ";
    }
    // add stress to {lo}
    else if (
      tailWord.length === 2 &&
      t0 !== undefined && t0.length > 0 &&
      t1 !== undefined &&
      /o/.test(t1.charAt(0))
    ) {
      const headWord = splitWord.slice(0, -2);

      modifiedWord = headWord.join("") + t0 + t1 + "\u0301";
      postfix = postfix + " ";
    }

    // add a pause even after a cmavo
    const prevWord = words[index - 1];
    if (!(index - 1 >= 0 && prevWord !== undefined && starterWords.includes(prevWord))) {
      prefix = " " + prefix;
    }

    let rebuiltWord = "";
    for (let idx = 0; idx < modifiedWord.length; idx++) {
      const tail = modifiedWord.slice(idx);
      let matched = false;
      let consumed = 1;
      for (const [attr, val] of Object.entries(rukMapping).sort(
        (a, b) => b[0].length - a[0].length
      )) {
        const pattern = new RegExp("^" + attr);
        const matches = pattern.exec(tail);
        if (matches) {
          const match = matches[0];
          consumed = match !== undefined ? match.length : 0;
          rebuiltWord += val;
          matched = true;
          break;
        }
      }

      if (!matched) {
        const c = modifiedWord[idx];
        if (c !== undefined) rebuiltWord += c;
      }
      rebuiltWord = rebuiltWord
        .replace(/([wй])\u0301/g, "\u0301$1")
        .replace(/^лэ/g, "ле");

      idx += consumed - 1;
    }
    rebuiltWords.push(prefix + rebuiltWord + postfix);
  }
  return rebuiltWords
    .join(" ")
    .replace(/ {2,}/g, " ")
    .trim()
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      const first = trimmed.charAt(0);
      return first !== "" ? `${first.toUpperCase()}${trimmed.slice(1)}.` : ".";
    })
    .map((i) => (i === "." ? "" : i))
    .join("\n")
    .replace(/ +\./g, ".")
    .replace(/\.{2,}/g, ".");
};
