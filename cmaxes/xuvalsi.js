const xuvalsi = (str,type,cmaxes) => {
  try{return cmaxes(str)["te spuda"][0][0]===type;}catch(e){return false;}
}

const xugismu = (str,cmaxes) => {return xuvalsi(str, "gismu", cmaxes);}
const xulujvo = (str,cmaxes) => {return xuvalsi(str, "lujvo", cmaxes);}

module.exports = {xuvalsi, xugismu, xulujvo}
