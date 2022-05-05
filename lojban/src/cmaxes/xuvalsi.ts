export const xuvalsi = (str: any, type: string, cmaxes: (arg0: any) => { (): any; new(): any;[x: string]: any }) => {
  try {
    const c = cmaxes(str)["te spuda"]
    return c.length === 1 && c[0][0] === type
  } catch (e) {
    return false
  }
}

export const xugismu = (str: any, cmaxes: any) => {
  return xuvalsi(str, "gismu", cmaxes)
}
export const xulujvo = (str: any, cmaxes: any) => {
  return xuvalsi(str, "lujvo", cmaxes)
}

