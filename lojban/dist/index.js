"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wiktionary = exports.gloss = exports.loglan2lojban = exports.lojban2loglan = exports.rotpaci = exports.modzi = exports.anji = exports.zeizei = exports.ilmentufa_exp = exports.ilmentufa_off = exports.xugismu = exports.xulujvo = exports.rafsi_giho_nai_se_rafsi = exports.dump = exports.word = exports.selmaho = exports.rafsi = exports.jvokaha_gui = exports.jvokaha2 = exports.jvokaha = exports.jvozba = exports.krulermorna = exports.rukylermorna = exports.jbopomofo = exports.cmaxes = exports.romoi_lahi_cmaxes = void 0;
const english = require("./bangu/english");
const vrici = require("./ceha/vrici");
const sozysozbot_jvozba_1 = require("./sozysozbot_jvozba");
const xuvalsi_1 = require("./cmaxes/xuvalsi");
const cmaxes_1 = require("./cmaxes/cmaxes");
const zeizei_1 = require("./ceha/zeizei");
const romoi_lahi_cmaxes = (te_gerna) => {
    try {
        const terspuda = cmaxes_1.parse(te_gerna);
        return { tcini: "snada", "te spuda": terspuda, kampu: terspuda };
    }
    catch (e) {
        return { tcini: "fliba", "te spuda": e, kampu: e.toString() };
    }
};
exports.romoi_lahi_cmaxes = romoi_lahi_cmaxes;
const cmaxes = ({ te_gerna, versiio = "index", }) => {
    try {
        const terspuda = require(`./src/cmaxes/${versiio}`).parse(te_gerna);
        return { tcini: "snada", "te spuda": terspuda, kampu: terspuda };
    }
    catch (e) {
        return { tcini: "fliba", "te spuda": e, kampu: e.toString() };
    }
};
exports.cmaxes = cmaxes;
const jbopomofo = (te_gerna) => vrici.jbopomofo(te_gerna);
exports.jbopomofo = jbopomofo;
const rukylermorna = (te_gerna) => vrici.rukylermorna(te_gerna);
exports.rukylermorna = rukylermorna;
const krulermorna = (te_gerna) => vrici.krulermorna(te_gerna);
exports.krulermorna = krulermorna;
const jvozba = (selcmima) => sozysozbot_jvozba_1.jvozba(selcmima);
exports.jvozba = jvozba;
const jvokaha = (valsi) => sozysozbot_jvozba_1.jvokaha(valsi);
exports.jvokaha = jvokaha;
const jvokaha2 = (valsi) => sozysozbot_jvozba_1.jvokaha2(valsi);
exports.jvokaha2 = jvokaha2;
const jvokaha_gui = (valsi) => sozysozbot_jvozba_1.jvokaha_gui(valsi);
exports.jvokaha_gui = jvokaha_gui;
const rafsi = (valsi, jsonDoc, bangu) => english.rafsi(valsi, jsonDoc, xugismu, bangu);
exports.rafsi = rafsi;
const selmaho = ({ word, jsonDoc, bangu, }) => english.selmaho({ word, jsonDoc, bangu });
exports.selmaho = selmaho;
const word = ({ word, jsonDoc }) => english.word({ word, jsonDoc });
exports.word = word;
const dump = ({ doc, bangu }) => english.fastParse({ bangu, doc });
exports.dump = dump;
const rafsi_giho_nai_se_rafsi = (valsi, jsonDoc, bangu) => english.rafsi_giho_nai_se_rafsi(valsi, jsonDoc, xugismu, bangu);
exports.rafsi_giho_nai_se_rafsi = rafsi_giho_nai_se_rafsi;
const xulujvo = (te_gerna) => xuvalsi_1.xulujvo(te_gerna, exports.romoi_lahi_cmaxes);
exports.xulujvo = xulujvo;
function xugismu(te_gerna) {
    return xuvalsi_1.xugismu(te_gerna, exports.romoi_lahi_cmaxes);
}
exports.xugismu = xugismu;
function ilmentufa_off(te_gerna, mode, preprocess) {
    if (preprocess)
        te_gerna = require("../libs/ilmentufa/camxes_preproc.js").preprocessing(te_gerna);
    try {
        const terspuda = require("../libs/ilmentufa/camxes_postproc.js").postprocessing(require("../libs/ilmentufa/camxes.js").parse(te_gerna), mode);
        return { tcini: "snada", "te spuda": terspuda, kampu: terspuda };
    }
    catch (e) {
        return { tcini: "fliba", "te spuda": e, kampu: e.toString() };
    }
}
exports.ilmentufa_off = ilmentufa_off;
function ilmentufa_exp(te_gerna, mode, preprocess) {
    if (preprocess)
        te_gerna = require("../libs/ilmentufa/camxes_preproc.js").preprocessing(te_gerna);
    try {
        const terspuda = require("../libs/ilmentufa/camxes_postproc.js").postprocessing(require("../libs/ilmentufa/camxes-beta.js").parse(te_gerna), mode);
        return { tcini: "snada", "te spuda": terspuda, kampu: terspuda };
    }
    catch (e) {
        return { tcini: "fliba", "te spuda": e, kampu: e.toString() };
    }
}
exports.ilmentufa_exp = ilmentufa_exp;
const zeizei = (te_gerna, returnFullInfo) => zeizei_1.zeizei(te_gerna, exports.romoi_lahi_cmaxes, sozysozbot_jvozba_1.jvokaha_gui, xuvalsi_1.xulujvo, sozysozbot_jvozba_1.jvokaha, sozysozbot_jvozba_1.search_selrafsi_from_rafsi2, returnFullInfo);
exports.zeizei = zeizei;
const anji = (te_gerna) => require("./ceha/anji")(te_gerna, exports.zeizei, exports.romoi_lahi_cmaxes);
exports.anji = anji;
const modzi = (te_gerna, rawOutput) => require("./ceha/modzi")(te_gerna, exports.zeizei, exports.romoi_lahi_cmaxes, rawOutput);
exports.modzi = modzi;
const rotpaci = (te_gerna) => zeizei_1.rotpaci(te_gerna);
exports.rotpaci = rotpaci;
const lojban2loglan = (te_gerna) => {
    return require("./bangu/loglan").lojban2loglan(te_gerna, exports.romoi_lahi_cmaxes);
};
exports.lojban2loglan = lojban2loglan;
const loglan2lojban = (te_gerna) => require("./bangu/loglan").loglan2lojban(te_gerna);
exports.loglan2lojban = loglan2lojban;
const gloss = (te_gerna, bangu, jsonDoc, pilno_logentufa) => english.gloss(te_gerna, bangu, pilno_logentufa ? ilmentufa_off : false, jsonDoc);
exports.gloss = gloss;
const wiktionary = (te_gerna, bangu, akti) => english.wiktionary(te_gerna, bangu, akti);
exports.wiktionary = wiktionary;
