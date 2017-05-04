const selmaho = (lin,xmlDump) => {
  let gag = '';
  let ien = '';
  const coun = xmlDocEn.get(`/dictionary/direction[1]/valsi[translate(@word,"${lin.toUpperCase()}","${lin}")="${lin}"]/selmaho[1]`);
  if (typeof coun !== 'undefined') {
    ien = `.i lu ${lin} li'u cmavo lu ${coun.text()} li'u`;
    const cll = require('./cll.js');
    const cllarr = cll.cllk()[coun.text()];
    if (typeof cllarr !== 'undefined') {
      ien += `\n${cllarr.replace(/ /g,"\n")}`;
    }
  }
  try {
    const ali = xmlDocEn.find(`/dictionary/direction[1]/valsi[starts-with(translate(./selmaho,"${lin.toUpperCase()}","${lin}"),"${lin}")]`);
    const stra = [];
    for (let i = 0; i < ali.length; i++) {
      //te = xmlDocEn.get("/dictionary/direction[1]/valsi[translate(@word,\""+ali[i].attr("word").value()+"\",\""+ali[i].attr("word").value()+"\")=\""+ali[i].attr("word").value()+"\"]/selmaho[1]").text();
      //lg(te);
      //if (te.search("^"+lin.toUpperCase()+"h")===-1){
      stra.push(ali[i].attr("word").value());
      //}
    }
    gag = stra.join(", ").trim();
    //if (stra.length==1){gag = gag + ' = ' + tordu(gag,lng);}
  } catch (err) {}
  switch (true) {
    case (ien !== '') && (gag !== ''):
      gag = ien.concat("\ncmavo: ").concat(gag);
      break;
    case (ien === '') && (gag !== ''):
      gag = `cmavo: ${gag}`;
      break;
    case (ien !== '') && (gag === ''):
      gag = ien;
      break;
    case (ien === '') && (gag === ''):
      gag = nodasezvafahi;
      break;
  }
  return gag;
};
