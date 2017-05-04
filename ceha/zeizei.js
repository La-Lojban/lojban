const zeizei = (text,gentufa,jvokaha_gui,xulujvo,jvokaha,search_selrafsi_from_rafsi2) => { //insert spaces to lojban sentences, split lujvo into zo zei zei lujvo
  text = gentufa(text,"Q");
  text = text.map(a => a[1].replace(/-/g,'')).filter(a => a!==' ');
  for (let j = 0; j < text.length; j++) {
    if (xulujvo(text[j],gentufa) === true) {
      text[j] = jvokaha_gui(text[j],jvokaha,search_selrafsi_from_rafsi2).join(" ").replace(/^a-z'/g,'');
      if (text[j].search(/^((se|te|ve|xe|na'e|je'a|to'e) )+[^ ]+$/) === 0) {
        text[j] = text[j].replace(/ /g, " ");
      } else {
        text[j] = text[j].replace(/ /g, " zei ");
      }
    }
  }
  text = text.join(" ").trim();
  return text;
};
const rotpaci = te_gerna => te_gerna.trim().replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));

module.exports = {zeizei,rotpaci};