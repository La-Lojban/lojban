export type ParseResult = { tcini: string; kampu: Array<[string, string]> | string };
export const zeizei = (
  text: string,
  parser: (arg0: string, arg1?: string) => ParseResult,
  searchSelrafsiFromRafsi2: (rafsi: string) => string | undefined | null,
  returnFullInfo?: boolean
) => {
  const fullInfo = returnFullInfo ?? false;
  //insert spaces to lojban sentences, split lujvo into zo zei zei lujvo
  const parseResult = parser(text, "Q");
  if (parseResult.tcini === "fliba") return "";
  const kampu = parseResult.kampu;
  if (typeof kampu === "string" || !Array.isArray(kampu)) return "";
  const result = kampu
    .filter((token: [string, string]) => token[1] !== " ")
    .map((segment: [string, string]) => {
      let word: string = String(segment[1] ?? "")
      const wordClass: string = String(segment[0] ?? "")
      if (wordClass === "lujvo") {
        word = word
          .split("-")
          .filter(function (part: string) {
            return part !== "'y" && part !== "y"
          })
          .map(function (part: string) {
            return searchSelrafsiFromRafsi2(part) ?? part
          })
          .join(" zei ")
      }
      return fullInfo ? [wordClass, word] : word
    })

  return (fullInfo ? result : result.join(" ").trim()) as ZeizeiReturn;
}
export type ZeizeiReturn = string | (string | [string, string])[];

export const rotpaci = (text: string) =>
  text
    .trim()
    .replace(/[a-zA-Z]/g, (char: string) => {
      const code = char.charCodeAt(0) + 13;
      const bound = char <= "Z" ? 90 : 122;
      return String.fromCharCode(bound >= code ? code : code - 26);
    })
