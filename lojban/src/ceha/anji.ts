import { jbopomofo } from "./vrici"
import * as anji_json from './anji.json'

export function anji(
  te_gerna: string,
  zeizei: (te_gerna: any, returnFullInfo?: any) => any,
  gentufa: (
    te_gerna: string
  ) => {
    tcini: string
    "te spuda": any
    kampu: any
  }
) {
  te_gerna = zeizei(te_gerna)
  let arr_te_gerna = gentufa(te_gerna).kampu
  arr_te_gerna = arr_te_gerna.map((valsi: any[], index: any) => {
    if (valsi[0].indexOf("fu'ivla") >= 0 || valsi[0].indexOf("cmevla") >= 0) {
      valsi[1] = jbopomofo(valsi[1])
    } else {
      valsi[1] = (anji_json as any)[valsi[1]] || " " + valsi[1]
    }
    return [valsi[0], valsi[1]]
  })
  return arr_te_gerna
    .filter((valsi: string[], index: number) => {
      if (
        valsi[0] === "drata" &&
        ((te_gerna[index + 1] &&
          (te_gerna[index + 1][0].indexOf("cmevla") >= 0 ||
            te_gerna[index + 1][0].indexOf("fu'ivla") >= 0)) ||
          (te_gerna[index - 1] &&
            (te_gerna[index - 1][0].indexOf("cmevla") >= 0 ||
              te_gerna[index - 1][0].indexOf("fu'ivla") >= 0)))
      )
        return true
      if (valsi[0] === "drata") return false
      return true
    })
    .map((valsi: any[]) => {
      if (valsi[0] === "drata") return " "
      return valsi[1]
    })
    .join("")
    .trim()
}
