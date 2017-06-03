const zeizei = (text,gentufa,jvokaha_gui,xulujvo,jvokaha,search_selrafsi_from_rafsi2) => { //insert spaces to lojban sentences, split lujvo into zo zei zei lujvo
  return gentufa(text,"Q")
  .map(a => a[1].replace(/-/g,'')).filter(a => a!==' ')
  .map(j=>
    {
      if (xulujvo(j,gentufa) === true) {
        const a = jvokaha_gui(j,jvokaha,search_selrafsi_from_rafsi2).join(" ").replace(/^a-z'/g,'');
        if (a.search(/^((se|te|ve|xe|na'e|je'a|to'e) )+[^ ]+$/) === 0) {
          return a.replace(/ /g, " ");
        }
        return a.replace(/ /g, " zei ");
      }  
      return j;
    }
  )
  .join(" ").trim();
};
const rotpaci = te_gerna => te_gerna.trim().replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));

module.exports = {zeizei,rotpaci};