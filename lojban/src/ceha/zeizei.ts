export const zeizei = (
  text: any,
  gentufa: (arg0: any, arg1: string) => any,
  jvokaha_gui: any,
  xulujvo: any,
  jvokaha: any,
  search_selrafsi_from_rafsi2: (arg0: any) => any,
  returnFullInfo: any
) => {
  //insert spaces to lojban sentences, split lujvo into zo zei zei lujvo
  const g = gentufa(text, "Q")
  if (g.tcini === "fliba") return ""
  const result = g["kampu"]
    .filter((a: string[]) => a[1] !== " ")
    .map((j: any[]) => {
      var valsi = j[1]
      var klesi = j[0]
      if (klesi === "lujvo") {
        valsi = valsi
          .split("-")
          .filter(function (i: string) {
            return i !== "'y" && i !== "y"
          })
          .map(function (i: string) {
            return search_selrafsi_from_rafsi2(i) || i
          })
          .join(" zei ")
      }
      return returnFullInfo ? [klesi, valsi] : valsi
    })

  return returnFullInfo ? result : result.join(" ").trim()
}

export const rotpaci = (te_gerna: string) =>
  te_gerna
    .trim()
    .replace(/[a-zA-Z]/g, (c: any) =>
      String.fromCharCode(
        (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
      )
    )
