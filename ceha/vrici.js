const jbopomofo = te_gerna=>{
  const cartu={
    "a":"ㄚ","e":"ㄜ","i":"ㄧ","o":"ㄛ","u":"ㄨ","y":"ㄩ","f":"ㄈ","v":"ㄑ","x":"ㄏ",
    "s":"ㄙ","z":"ㄗ","c":"ㄕ","j":"ㄓ","p":"ㄆ","b":"ㄅ","t":"ㄊ","d":"ㄉ","k":"ㄎ",
    "g":"ㄍ","l":"ㄌ","r":"ㄖ","m":"ㄇ","n":"ㄋ","`":"¯",".":"·","'":"、",",":"〜"
  };
  Object.keys(cartu).map(key => {
    const k = new RegExp(key,"gim");
    te_gerna = te_gerna.replace(k,cartu[key]);
    });
  return te_gerna;
}

const rukylermorna = te_gerna=>{
  const cartu={
    "a":"а","e":"э","i":"и","o":"о","u":"у","y":"ы","f":"ф","v":"в","x":"х",
    "s":"с","z":"з","c":"ш","j":"ж","p":"п","b":"б","t":"т","d":"д","k":"к",
    "g":"г","l":"л","r":"р","m":"м","n":"н"
  };
  Object.keys(cartu).map(key => {
    const k = new RegExp(key,"gim");
    te_gerna = te_gerna.replace(k,cartu[key]);
    });
  return te_gerna;
}

const krulermorna = te_gerna=>{
  return te_gerna
  .replace(/h/g, "'")
  .replace(/\bu([aeiou])/gi, 'w$1')
  .replace(/\bi([aeiou])/gi, 'ɩ$1')
  .replace(/au/gi, 'ǎ')
  .replace(/ai/gi, 'ą')
  .replace(/ei/gi, 'ę')
  .replace(/oi/gi, 'ǫ');
}

module.exports = {jbopomofo, rukylermorna, krulermorna}
