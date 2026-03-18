interface ParserOutput {
  "te spuda": Array<[string, unknown]> | Array<[string]> | string;
}
export const xuvalsi = (text: string, type: string, parser: (arg0: string) => ParserOutput) => {
  try {
    const parseOutput = parser(text)["te spuda"];
    if (typeof parseOutput === "string" || !Array.isArray(parseOutput)) return false;
    const first = parseOutput[0];
    return parseOutput.length === 1 && first !== undefined && first[0] === type;
  } catch {
    return false;
  }
}

export const xugismu = (text: string, parser: (arg0: string) => ParserOutput) => {
  return xuvalsi(text, "gismu", parser)
}
export const xulujvo = (text: string, parser: (arg0: string) => ParserOutput) => {
  return xuvalsi(text, "lujvo", parser)
}

