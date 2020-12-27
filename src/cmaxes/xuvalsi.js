const xuvalsi = (str, type, cmaxes) => {
  try {
    const c = cmaxes(str)["te spuda"]
    return c.length === 1 && c[0][0] === type
  } catch (e) {
    return false
  }
}

const xugismu = (str, cmaxes) => {
  return xuvalsi(str, "gismu", cmaxes)
}
const xulujvo = (str, cmaxes) => {
  return xuvalsi(str, "lujvo", cmaxes)
}

module.exports = {
  xuvalsi,
  xugismu,
  xulujvo,
}
