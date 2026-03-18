import { jbopomofo } from "./vrici"
import * as anji_json from './anji.json'

type ParserResult = { tcini: string; "te spuda": unknown; kampu: Array<[string, string]> | string };
export function anji(
  text: string,
  zeizei: (text: string, returnFullInfo?: boolean) => import("./zeizei").ZeizeiReturn,
  parser: (text: string) => ParserResult
) {
  const zeizeiOut = zeizei(text);
  text = typeof zeizeiOut === "string" ? zeizeiOut : zeizeiOut.join(" ");
  const parseResult = parser(text);
  if (parseResult.tcini !== "snada" || typeof parseResult.kampu === "string") return "";
  let segments = parseResult.kampu
  segments = segments.map((segment: [string, string]) => {
    if (segment[0].indexOf("fu'ivla") >= 0 || segment[0].indexOf("cmevla") >= 0) {
      segment[1] = jbopomofo(segment[1])
    } else {
      segment[1] = (anji_json as Record<string, string>)[segment[1]] || " " + segment[1]
    }
    return [segment[0], segment[1]]
  })
  return segments
    .filter((segment: string[], index: number) => {
      const next = segments[index + 1];
      const prev = segments[index - 1];
      if (
        segment[0] === "drata" &&
        ((next &&
          (next[0].indexOf("cmevla") >= 0 || next[0].indexOf("fu'ivla") >= 0)) ||
          (prev &&
            (prev[0].indexOf("cmevla") >= 0 || prev[0].indexOf("fu'ivla") >= 0)))
      )
        return true
      if (segment[0] === "drata") return false
      return true
    })
    .map((segment: [string, string]) => {
      if (segment[0] === "drata") return " "
      return segment[1]
    })
    .join("")
    .trim()
}
