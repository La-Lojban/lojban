"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anji = void 0;
const vrici_1 = require("./vrici");
const anji_json = require("./anji.json");
function anji(te_gerna, zeizei, gentufa) {
    te_gerna = zeizei(te_gerna);
    let arr_te_gerna = gentufa(te_gerna).kampu;
    arr_te_gerna = arr_te_gerna.map((valsi, index) => {
        if (valsi[0].indexOf("fu'ivla") >= 0 || valsi[0].indexOf("cmevla") >= 0) {
            valsi[1] = vrici_1.jbopomofo(valsi[1]);
        }
        else {
            valsi[1] = anji_json[valsi[1]] || " " + valsi[1];
        }
        return [valsi[0], valsi[1]];
    });
    return arr_te_gerna
        .filter((valsi, index) => {
        if (valsi[0] === "drata" &&
            ((te_gerna[index + 1] &&
                (te_gerna[index + 1][0].indexOf("cmevla") >= 0 ||
                    te_gerna[index + 1][0].indexOf("fu'ivla") >= 0)) ||
                (te_gerna[index - 1] &&
                    (te_gerna[index - 1][0].indexOf("cmevla") >= 0 ||
                        te_gerna[index - 1][0].indexOf("fu'ivla") >= 0))))
            return true;
        if (valsi[0] === "drata")
            return false;
        return true;
    })
        .map((valsi) => {
        if (valsi[0] === "drata")
            return " ";
        return valsi[1];
    })
        .join("")
        .trim();
}
exports.anji = anji;
