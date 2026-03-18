import {
  gismu_rafsi_list,
  gismu_rafsi_list_exp,
  cmavo_rafsi_list,
  cmavo_rafsi_list_exp,
} from "./rafsi_list"
import { isPermissible } from "./morphology";

const expRafsi = true;

function createEveryPossibility(arrays: string[][]): string[][] {
  const arrArr = JSON.parse(JSON.stringify(arrays)) as string[][];
  if (arrArr.length === 0) {
    return [[]];
  }
  const arr = arrArr.pop() as string[];

  let result: string[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const e = arr[i];
    if (e === undefined) continue;
    result = result.concat(
      createEveryPossibility(arrArr).map((f: string[]) => f.concat([e]))
    );
  }
  return result;
}

function getGismuRafsiList(selrafsi: string): string[] | undefined {
  if (typeof gismu_rafsi_list[selrafsi as keyof typeof gismu_rafsi_list] !== "undefined") {
    return gismu_rafsi_list[selrafsi as keyof typeof gismu_rafsi_list];
  }
  if (expRafsi) {
    return gismu_rafsi_list_exp[selrafsi as keyof typeof gismu_rafsi_list_exp];
  }
  return undefined;
}

function getCmavoRafsiList(selrafsi: string): string[] | undefined {
  if (cmavo_rafsi_list[selrafsi as keyof typeof cmavo_rafsi_list]) {
    return cmavo_rafsi_list[selrafsi as keyof typeof cmavo_rafsi_list];
  }
  if (expRafsi) {
    return cmavo_rafsi_list_exp[selrafsi as keyof typeof cmavo_rafsi_list_exp];
  }
  return undefined;
}

/** getCandid("bloti", false) ==> ["lot", "blo", "lo'i", "blot"] */
function getCandid(selrafsi: string, isLast: boolean): string[] {
  const cmavoCandid = getCmavoRafsiList(selrafsi);
  if (cmavoCandid) {
    return cmavoCandid;
  }
  const candidList = getGismuRafsiList(selrafsi);
  if (candidList) {
    const gismu = selrafsi;
    const candid = candidList.concat([]);
    if (isLast) candid.push(gismu);
    const chopped = gismu.slice(0, -1);
    if (chopped !== "brod") candid.push(chopped);
    return candid;
  }
  return [];
}

export function search_selrafsi_from_rafsi2(rafsi: string): string | null {
  if (getGismuRafsiList(rafsi)) return rafsi;
  if (rafsi !== "brod" && rafsi.length === 4 && !rafsi.includes("'")) {
    for (let u = 0; u < 5; u++) {
      const gismuCandid = rafsi + "aeiou".charAt(u);
      if (getGismuRafsiList(gismuCandid)) return gismuCandid;
    }
  }
  for (const i of Object.keys(gismu_rafsi_list)) {
    const list = gismu_rafsi_list[i as keyof typeof gismu_rafsi_list];
    if (list?.includes(rafsi)) return i;
  }
  for (const j of Object.keys(cmavo_rafsi_list)) {
    const list = cmavo_rafsi_list[j as keyof typeof cmavo_rafsi_list];
    if (list?.includes(rafsi)) return j;
  }
  if (expRafsi) {
    for (const i of Object.keys(gismu_rafsi_list_exp)) {
      const list = gismu_rafsi_list_exp[i as keyof typeof gismu_rafsi_list_exp];
      if (list?.includes(rafsi)) return i;
    }
    for (const j of Object.keys(cmavo_rafsi_list_exp)) {
      const list = cmavo_rafsi_list_exp[j as keyof typeof cmavo_rafsi_list_exp];
      if (list?.includes(rafsi)) return j;
    }
  }
  return null;
}

function getLujvoScore(rafsiSequence: string[]) {
  const lujvo = rafsiSequence.join("");
  const L = lujvo.length;
  const A = lujvo.split("'").length - 1;
  let H = 0;
  let R = 0;
  for (let i = 0; i < rafsiSequence.length; i++) {
    const r = rafsiSequence[i];
    if (r === undefined) continue;
    switch (getCvInfo(r)) {
      case "C":
      case "Y":
        H++
        break // ynr-hyphen
      case "CVCCV":
        R += 1
        break
      case "CVCC":
        R += 2
        break
      case "CCVCV":
        R += 3
        break
      case "CCVC":
        R += 4
        break
      case "CVC":
        R += 5
        break
      case "CV'V":
        R += 6
        break
      case "CCV":
        R += 7
        break
      case "CVV":
        R += 8
        break
    }
  }
  const V = (lujvo.match(/[aeiou]/g) || []).length
  return 1000 * L - 500 * A + 100 * H - 10 * R - V
}

function getCvInfo(v: string): string {
  return v
    .split("")
    .map((c: string): string => {
      if ("aeiou".indexOf(c) !== -1) return "V"
      if ("bcdfgjklmnprstvxz".indexOf(c) !== -1) return "C"
      if (c === "'") return "'"
      if (c === "y") return "Y"
      return ""
    })
    .join("")
}

export function jvokaha(lujvo: string) {
  const arr = jvokaha2(lujvo)
  const rafsi_list = arr.filter(function (a) {
    return a.length !== 1 // remove ynr
  })

  const correct_lujvo = normalize(rafsi_list).join("") // recreate the lujvo from the rafsi list

  if (lujvo === correct_lujvo) {
    return arr
  } else {
    throw new Error(
      "malformed lujvo {" + lujvo + "}; it should be {" + correct_lujvo + "}"
    )
  }
}

export function jvokaha2(lujvo: string): string[] {
  const original_lujvo = lujvo
  const res = []
  while (true) {
    if (lujvo === "") return res

    //remove hyphen
    const lastRes = res[res.length - 1];
    if (res.length > 0 && lastRes !== undefined && lastRes.length !== 1) {
      // hyphen cannot begin a word; nor can two hyphens
      const c1 = lujvo.charAt(1);
      if (
        lujvo.charAt(0) === "y" || // y-hyphen
        lujvo.slice(0, 2) === "nr" || // n-hyphen is only allowed before r
        (lujvo.charAt(0) === "r" && c1 !== "" && getCvInfo(c1) === "C") // r followed by a consonant
      ) {
        res.push(lujvo.charAt(0))
        lujvo = lujvo.slice(1)
        continue
      }
    }

    //drop rafsi from front

    //CVV can always be dropped
    if (
      getCvInfo(lujvo.slice(0, 3)) === "CVV" &&
      ["ai", "ei", "oi", "au"].indexOf(lujvo.slice(1, 3)) !== -1
    ) {
      res.push(lujvo.slice(0, 3))
      lujvo = lujvo.slice(3)
      continue
    }

    //CV'V can always be dropped
    if (getCvInfo(lujvo.slice(0, 4)) === "CV'V") {
      res.push(lujvo.slice(0, 4))
      lujvo = lujvo.slice(4)
      continue
    }

    //CVCCY and CCVCY can always be dropped
    //how about checking if CC is persimmisble? *FIXME*
    if (
      getCvInfo(lujvo.slice(0, 5)) === "CVCCY" ||
      getCvInfo(lujvo.slice(0, 5)) === "CCVCY"
    ) {
      res.push(lujvo.slice(0, 4))
      res.push("y")
      lujvo = lujvo.slice(5)
      continue
    }

    //the final rafsi can be 5-letter
    if (getCvInfo(lujvo) === "CVCCV" || getCvInfo(lujvo) === "CCVCV") {
      res.push(lujvo)
      return res
    }

    if (
      getCvInfo(lujvo.slice(0, 3)) === "CVC" ||
      getCvInfo(lujvo.slice(0, 3)) === "CCV"
    ) {
      res.push(lujvo.slice(0, 3))
      lujvo = lujvo.slice(3)
      continue
    }

    // if all fails...
    return [original_lujvo]
  }
}

export function jvokaha_gui(txt: string): string[] | null {
  txt = txt.replace(/h/g, "'")
  txt = txt.toLowerCase()
  let arr: string[]
  try {
    arr = jvokaha2(txt)
  } catch {
    return null
  }
  arr = arr.filter(function (a) {
    return a.length > 1
  })
  arr = arr.map(function (rafsi) {
    const selrafsi = search_selrafsi_from_rafsi2(rafsi)
    if (selrafsi) {
      return selrafsi
    } else {
      return "-" + rafsi + "-" // output as rafsi form; signify as unknown
    }
  })
  return arr
}

export function jvozba(arr: string | string[], forbid_la_lai_doi?: boolean) {
  const candidArr: string[][] = [];
  const arrLen = arr.length;

  for (let i = 0; i < arrLen; i++) {
    const el = (arr as string[])[i];
    if (el !== undefined) {
      candidArr.push(getCandid(el, i === arrLen - 1));
    }
  }

  const answers = createEveryPossibility(candidArr as string[][])
    .map((rafsiList: string[]) => {
      const result = normalize(rafsiList);
      return {
        lujvo: result.join(""),
        score: getLujvoScore(result),
      };
    })
    .filter((d: { lujvo: string }) => {
      const l = d.lujvo;
      return !(
        isCmevla(l) &&
        forbid_la_lai_doi &&
        (l.match(/^(lai|doi)/) ||
          l.match(/[aeiouy](lai|doi)/) ||
          l.match(/^la[^u]/) || // the fact that CLL explicitly forbids two sequences `la` and `lai` signifies that `lau` is not forbidden
          l.match(/[aeiouy]la[^u]/))
      )
    })
    .sort(function (a: { score: number }, b: { score: number }) {
      return a.score - b.score
    })

  return answers
}

function isCmevla(valsi: string) {
  return (
    valsi.length >= 1 &&
    "aeiouy'".indexOf(valsi.charAt(valsi.length - 1)) === -1
  );
}

function normalize(rafsi_list: string[]) {
  if (rafsi_list.length === 1) {
    throw new Error("You need at least two valsi to make a lujvo")
  }

  const input = rafsi_list.concat([]); // copy
  const last = input.pop();
  if (last === undefined) throw new Error("Empty rafsi list");
  const result: string[] = [last];

  while (input.length) {
    const rafsi = input.pop();
    if (rafsi === undefined) break;
    const first = result[0];
    if (first === undefined) break;
    const end = rafsi.charAt(rafsi.length - 1);
    const init = first.charAt(0);

    if (isFourLetter(rafsi)) {
      result.unshift("y");
    } else if (
      getCvInfo(end) === "C" &&
      getCvInfo(init) === "C" &&
      isPermissible(end, init) === 0
    ) {
      result.unshift("y");
    } else if (
      end === "n" &&
      ["ts", "tc", "dz", "dj"].indexOf(first.slice(0, 2)) !== -1
    ) {
      result.unshift("y");
    } else if (input.length === 0 && isCvv(rafsi)) {
      let hyphen = "r";
      if (first.startsWith("r")) hyphen = "n";
      if (rafsi_list.length > 2 || !isCcv(first)) {
        result.unshift(hyphen);
      }
    } else if (
      input.length === 0 &&
      isCvc(rafsi) &&
      isTosmabru(rafsi, result)
    ) {
      result.unshift("y");
    }

    result.unshift(rafsi);
  }

  return result
}

function isTosmabru(rafsi: string, rest: string | string[]): boolean {
  const lastRest = rest[rest.length - 1];
  if (lastRest !== undefined && isCmevla(lastRest)) return true;

  let index = -1;
  for (let i = 0; i < rest.length; i++) {
    const ri = rest[i];
    if (ri === undefined) continue;
    if (isCvc(ri)) continue;
    index = i;
    if (
      ri === "y" ||
      (getCvInfo(ri) === "CVCCV" && 2 === isPermissible(ri.charAt(2), ri.charAt(3)))
    ) {
      break;
    }
    return false;
  }

  const tmp2Start = rest[0];
  if (tmp2Start === undefined || index < 0) return true;

  let tmp1 = rafsi;
  let tmp2: string | undefined = tmp2Start;
  let j = 0;
  do {
    if (tmp2 === undefined || tmp2 === "y") return true;
    if (2 !== isPermissible(tmp1.charAt(tmp1.length - 1), tmp2.charAt(0))) {
      return false;
    }
    tmp1 = tmp2;
    j++;
    tmp2 = rest[j];
  } while (j <= index);
  return true;
}

function isCvv(rafsi: string) {
  return getCvInfo(rafsi) === "CVV" || getCvInfo(rafsi) === "CV'V";
}

function isCcv(rafsi: string) {
  return getCvInfo(rafsi) === "CCV";
}

function isCvc(rafsi: string) {
  return getCvInfo(rafsi) === "CVC";
}

function isFourLetter(rafsi: string) {
  return getCvInfo(rafsi) === "CVCC" || getCvInfo(rafsi) === "CCVC";
}
