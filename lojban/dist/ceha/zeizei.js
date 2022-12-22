"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotpaci = exports.zeizei = void 0;
const zeizei = (text, gentufa, jvokaha_gui, xulujvo, jvokaha, search_selrafsi_from_rafsi2, returnFullInfo) => {
    //insert spaces to lojban sentences, split lujvo into zo zei zei lujvo
    const g = gentufa(text, "Q");
    if (g.tcini === "fliba")
        return "";
    const result = g["kampu"]
        .filter((a) => a[1] !== " ")
        .map((j) => {
        var valsi = j[1];
        var klesi = j[0];
        if (klesi === "lujvo") {
            valsi = valsi
                .split("-")
                .filter(function (i) {
                return i !== "'y" && i !== "y";
            })
                .map(function (i) {
                return search_selrafsi_from_rafsi2(i) || i;
            })
                .join(" zei ");
        }
        return returnFullInfo ? [klesi, valsi] : valsi;
    });
    return returnFullInfo ? result : result.join(" ").trim();
};
exports.zeizei = zeizei;
const rotpaci = (te_gerna) => te_gerna
    .trim()
    .replace(/[a-zA-Z]/g, (c) => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
exports.rotpaci = rotpaci;
