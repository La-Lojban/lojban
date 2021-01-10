"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xulujvo = exports.xugismu = exports.xuvalsi = void 0;
const xuvalsi = (str, type, cmaxes) => {
    try {
        const c = cmaxes(str)["te spuda"];
        return c.length === 1 && c[0][0] === type;
    }
    catch (e) {
        return false;
    }
};
exports.xuvalsi = xuvalsi;
const xugismu = (str, cmaxes) => {
    return exports.xuvalsi(str, "gismu", cmaxes);
};
exports.xugismu = xugismu;
const xulujvo = (str, cmaxes) => {
    return exports.xuvalsi(str, "lujvo", cmaxes);
};
exports.xulujvo = xulujvo;
