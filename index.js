module.exports = {
  romoi_lahi_cmaxes: te_gerna => {
    try {
      return require('./cmaxes').parse(te_gerna);
    } catch (e) {
      return [];
    }
  },
  jbopomofo: te_gerna => {
    return require('./ceha/vrici.js').jbopomofo(te_gerna);
  },
  rukylermorna: te_gerna => {
    return require('./ceha/vrici.js').rukylermorna(te_gerna);
  },
  krulermorna: te_gerna => {
    return require('./ceha/vrici.js').krulermorna(te_gerna);
  },
  jvozba: selcmima => {
    return require('./sozysozbot_jvozba').jvozba(selcmima);
  },
  jvokaha: valsi => {
    return require('./sozysozbot_jvozba').jvokaha(valsi);
  },
  jvokaha2: valsi => {
    return require('./sozysozbot_jvozba').jvokaha2(valsi);
  },
  jvokaha_gui: valsi => {
    return require('./sozysozbot_jvozba').jvokaha_gui(valsi);
  },
  rafsi: (valsi, xmlDoc) => {
    return require('./bangu/english.js').rafsi(valsi, xmlDoc, module.exports.xugismu);
  },
  rafsi_giho_nai_se_rafsi_gui: (valsi, xmlDoc) => {
    return require('./bangu/english.js').rafsi_giho_nai_se_rafsi_gui(valsi, xmlDoc, module.exports.xugismu);
  },
  xulujvo: te_gerna => {
    return require('./cmaxes/xuvalsi.js').xulujvo(te_gerna, module.exports.romoi_lahi_cmaxes);
  },
  xugismu: te_gerna => {
    return require('./cmaxes/xuvalsi.js').xugismu(te_gerna, module.exports.romoi_lahi_cmaxes);
  },
  ilmentufa_off: (te_gerna, mode, preprocess) => {
    if (preprocess)
      te_gerna = require('./ilmentufa/camxes_preproc.js').preprocessing(te_gerna);
    try {
      return require('./ilmentufa/camxes_postproc.js').postprocessing(require('./ilmentufa/camxes.js').parse(te_gerna), mode);
    } catch (err) {
      const location_info = err.location
        ? '\nLocation: [' + err.location.start.offset + ', ' + err.location.end.offset + ']' + '\n…' + te_gerna.substring(err.location.start.offset, err.location.start.offset + 12) + '…'
        : "";
      return err.toString() + location_info;
    }
  },
  ilmentufa_exp: (te_gerna, mode, preprocess) => {
    if (preprocess)
      te_gerna = require('./ilmentufa/camxes_preproc.js').preprocessing(te_gerna);
    try {
      return require('./ilmentufa/camxes_postproc.js').postprocessing(require('./ilmentufa/camxes-beta.js').parse(te_gerna), mode);
    } catch (err) {
      const location_info = err.location
        ? '\nLocation: [' + err.location.start.offset + ', ' + err.location.end.offset + ']' + '\n…' + te_gerna.substring(err.location.start.offset, err.location.start.offset + 12) + '…'
        : "";
      return err.toString() + location_info;
    }
  },
  zeizei: te_gerna => {
    return require('./ceha/zeizei.js').zeizei(te_gerna, module.exports.romoi_lahi_cmaxes, module.exports.jvokaha_gui, require('./cmaxes/xuvalsi.js').xulujvo, module.exports.jvokaha, require('./sozysozbot_jvozba').search_selrafsi_from_rafsi2);
  },
  anji: te_gerna => {
    return require('./ceha/anji.js')(te_gerna, module.exports.zeizei);
  },
  rotpaci: te_gerna => {
    return require('./ceha/zeizei.js').rotpaci(te_gerna);
  },
  lojban2loglan: te_gerna => {
    return require('./bangu/loglan.js').lojban2loglan(te_gerna, module.exports.romoi_lahi_cmaxes);
  },
  loglan2lojban: te_gerna => {
    return require('./bangu/loglan.js').loglan2lojban(te_gerna);
  },
  gloss: (te_gerna, bangu, xmlDoc) => {
    return require('./bangu/english.js').gloss(te_gerna, bangu, module.exports.ilmentufa_off, xmlDoc);
  },
  zmifanva: (te_gerna, fanva, akti) => {
    require('./bangu/english.js').zmifanva(te_gerna, fanva, akti);
  },
  wiktionary: (te_gerna, bangu, akti) => {
    require('./bangu/english.js').wiktionary(te_gerna, bangu, akti);
  }
};
