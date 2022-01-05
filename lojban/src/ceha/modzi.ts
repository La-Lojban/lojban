import * as modzi_json from './modzi.json'

export function modzi(
  te_gerna: string,
  zeizei: (te_gerna: any, returnFullInfo?: any) => any,
  gentufa: (
    te_gerna: string
  ) => {
    tcini: string
    "te spuda": any
    kampu: any
  },
  rawOutput: boolean
) {
  te_gerna = zeizei(te_gerna)
  let arr_te_gerna = gentufa(te_gerna).kampu
  arr_te_gerna = arr_te_gerna.map((valsi: string[]) => {
    const valsi_1 = valsi[1]
    valsi[1] = (modzi_json as any)[valsi_1] || " " + valsi_1
    return [valsi[0], valsi[1]]
  })
  arr_te_gerna = arr_te_gerna.filter((valsi: string[], index: number) => {
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
  if (!rawOutput)
    return arr_te_gerna
      .map((valsi: any[]) => {
        if (valsi[0] === "drata") return " "
        return valsi[1]
      })
      .join("")
      .trim()

  return te_gerna
}
