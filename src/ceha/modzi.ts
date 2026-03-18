import * as modzi_json from './modzi.json'

type ParserResult = { tcini: string; "te spuda": unknown; kampu: Array<[string, string]> | string };
export function modzi(
  text: string,
  zeizei: (text: string, returnFullInfo?: boolean) => import("./zeizei").ZeizeiReturn,
  parser: (text: string) => ParserResult,
  rawOutput: boolean
) {
  const zeizeiOut = zeizei(text);
  text = typeof zeizeiOut === "string" ? zeizeiOut : zeizeiOut.join(" ");
  const parseResult = parser(text);
  if (parseResult.tcini !== "snada" || typeof parseResult.kampu === "string") return rawOutput ? text : "";
  let segments: Array<[string, string]> = parseResult.kampu
  segments = segments.map((segment: [string, string]) => {
    const segmentWord = segment[1];
    const key = segmentWord ?? "";
    const newVal = (modzi_json as Record<string, string>)[key] || " " + key;
    return [segment[0], newVal];
  })
  const next = (i: number) => segments[i + 1];
  const prev = (i: number) => segments[i - 1];
  segments = segments.filter((segment: string[], index: number) => {
    const n = next(index);
    const p = prev(index);
    if (
      segment[0] === "drata" &&
      ((n && (n[0].indexOf("cmevla") >= 0 || n[0].indexOf("fu'ivla") >= 0)) ||
        (p && (p[0].indexOf("cmevla") >= 0 || p[0].indexOf("fu'ivla") >= 0)))
    )
      return true
    if (segment[0] === "drata") return false
    return true
  })
  if (!rawOutput)
    return segments
      .map((segment: [string, string]) => {
        if (segment[0] === "drata") return " "
        return segment[1] ?? ""
      })
      .join("")
      .trim()

  return text
}
