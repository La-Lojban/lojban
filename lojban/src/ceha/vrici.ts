const jbopomofo = (te_gerna: string) => {
  const cartu: any = {
    a: "ㄚ",
    e: "ㄜ",
    i: "ㄧ",
    o: "ㄛ",
    u: "ㄨ",
    y: "ㄩ",
    f: "ㄈ",
    v: "ㄑ",
    x: "ㄏ",
    s: "ㄙ",
    z: "ㄗ",
    c: "ㄕ",
    j: "ㄓ",
    p: "ㄆ",
    b: "ㄅ",
    text: "ㄊ",
    d: "ㄉ",
    k: "ㄎ",
    g: "ㄍ",
    l: "ㄌ",
    r: "ㄖ",
    m: "ㄇ",
    n: "ㄋ",
    "`": "¯",
    "\\.": "·",
    "'": "、",
    ",": "〜",
  };
  Object.keys(cartu).map((key) => {
    const k = new RegExp(key, "gim");
    te_gerna = te_gerna.replace(k, cartu[key]);
  });
  return te_gerna;
};

const rukylermorna = (te_gerna: string) => {
  const cartu: any = {
    a: "а",
    e: "э",
    i: "и",
    o: "о",
    u: "у",
    y: "ы",
    f: "ф",
    v: "в",
    x: "х",
    s: "с",
    z: "з",
    c: "ш",
    j: "ж",
    p: "п",
    b: "б",
    t: "т",
    d: "д",
    k: "к",
    g: "г",
    l: "л",
    r: "р",
    m: "м",
    n: "н",
  };
  Object.keys(cartu).map((key: string) => {
    const k = new RegExp(key, "gim");
    te_gerna = te_gerna.replace(k, cartu[key]);
  });
  return te_gerna;
};

const krulermorna = (text: string) =>
  text
    .toLowerCase()
    .replace(/h/g, "'")
    .replace(/([ptkflscmxbdgvrzjnaeiouy\. ])u([aeiouy])/g, "$1w$2")
    .replace(/([ptkflscmxbdgvrzjnaeiouy\. ])i([aeiouy])/g, "$1ɩ$2")
    .replace(/^u([aeiouy])/g, "w$1")
    .replace(/^i([aeiouy])/g, "ɩ$1")
    .replace(/au/g, "ḁ")
    .replace(/ai/g, "ą")
    .replace(/ei/g, "ę")
    .replace(/oi/g, "ǫ");

const tibetan = (text: string) => {
  text = krulermorna( " " + text);

  //words
  text = text.replace(/\b(?<!')i(?!')\b/g, "།");
  text = text.replace(/\bce'o(?!')\b/g, "༉");
  text = text.replace(/\bni'o(?!')\b/g, "༈");
  text = text.replace(/\bsei(?!')\b/g, "༓");
  text = text.replace(/\bto(?!')\b/g, "༺");
  text = text.replace(/\btoi(?!')\b/g, "༻");
  text = text.replace(/\ble\b(?!')/g, "༼");
  text = text.replace(/\bku\b(?!')/g, "༽");

  //basic consonants:
  text = text.replace(/b/g, "བ\u200b");
  text = text.replace(/c/g, "ཤ\u200b");
  text = text.replace(/d/g, "ད\u200b");
  text = text.replace(/f/g, "ཕ ༹\u200b");
  text = text.replace(/g/g, "ག\u200b");
  text = text.replace(/[']/g, "ཧ\u200b");
  text = text.replace(/ɩ/g, "ཡ\u200b");
  text = text.replace(/j/g, "ཞ\u200b");
  text = text.replace(/k/g, "ཀ\u200b");
  text = text.replace(/l/g, "ལ\u200b");
  text = text.replace(/m/g, "མ\u200b");
  text = text.replace(/n/g, "ན\u200b");
  text = text.replace(/p/g, "པ\u200b");
  text = text.replace(/ (?=[aeiou])/g, "ཨ\u200b");
  text = text.replace(/r/g, "ར\u200b");
  text = text.replace(/s/g, "ས\u200b");
  text = text.replace(/t/g, "ཏ\u200b");
  text = text.replace(/v/g, "བ ༹\u200b");
  text = text.replace(/w/g, "ཝ\u200b");
  text = text.replace(/x/g, "ཁ\u0f39\u200b");
  text = text.replace(/z/g, "ཟ\u200b");

  text = text.replace(/ཏ\u200bཤ\u200b/g, "ཅ\u200b");//tc
  text = text.replace(/ད\u200bཞ\u200b/g, "ཇ\u200b");//dj
  text = text.replace(/ཏ\u200bས\u200b/g, "ཙ\u200b");//ts
  text = text.replace(/ད\u200bཟ\u200b/g, "ཛ\u200b");//dz

  // sub
  text = text.replace(/\u200bཀ/g, "ྐ"); //k
  text = text.replace(/\u200bག/g, "ྒ"); //g
  text = text.replace(/\u200bཅ/g, "ྕ"); //tc
  text = text.replace(/\u200bཇ/g, "ྗ"); //dj
  text = text.replace(/\u200bཏ/g, "ྟ"); //t
  text = text.replace(/\u200bད/g, "ྡ"); //d
  text = text.replace(/\u200bན/g, "ྣ"); //n
  text = text.replace(/\u200bཔ/g, "ྤ"); //p
  text = text.replace(/\u200bབ/g, "ྦ"); //b
  text = text.replace(/\u200bམ/g, "ྨ"); //m
  text = text.replace(/\u200bཙ/g, "ྩ"); //ts
  text = text.replace(/\u200bཛ/g, "ྫ"); //dz
  text = text.replace(/\u200bཝ/g, "ྭ"); //w
  text = text.replace(/\u200bཟ/g, "ྯ"); //z
  text = text.replace(/\u200bཡ/g, "ྱ"); //ɩ
  text = text.replace(/\u200bར/g, "ྲ"); //r
  text = text.replace(/\u200bལ/g, "ླ"); //l
  text = text.replace(/\u200bས/g, "ྶ"); //s

  //vowels:
  text = text.replace(/\u200ba/g, "");
  text = text.replace(/\u200bi/g, "ི");
  text = text.replace(/\u200bu/g, "ུ");
  text = text.replace(/\u200be/g, "ེ");
  text = text.replace(/\u200bo/g, "ོ");

  text = text.replace(/\u200bą/g, "ཱི");//ai

  text = text.replace(/\u200bḁ/g, "ཱུ");//au

  text = text.replace(/\u200bę/g, "ིེ");//ie=ei

  text = text.replace(/\u200bǫ/g, "ིོ");//io=oi

  text = text.replace(/\u200by/g, "ོེ");//oe=y

  //mark cmevla endings
  text = text.replace(/\u200b/g, "྄");

  //exchange positions
  text = text.replace(/(\u0f39)((\u0f7a|\u0f72|\u0f7c|\u0f74)+)/g, "$2$1");

  text = text.replace(/0/g, "༠");
  text = text.replace(/1/g, "༡");
  text = text.replace(/2/g, "༢");
  text = text.replace(/3/g, "༣");
  text = text.replace(/4/g, "༤");
  text = text.replace(/5/g, "༥");
  text = text.replace(/6/g, "༦");
  text = text.replace(/7/g, "༧");
  text = text.replace(/8/g, "༨");
  text = text.replace(/9/g, "༩");

  return text.trim();
};

export { jbopomofo, rukylermorna, krulermorna, tibetan };
