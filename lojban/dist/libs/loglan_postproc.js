"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postprocessing = void 0;
const postprocessing = function (ast, opts = {}) {
    return clearJson(ast, [null, undefined, '', ' '], opts);
};
exports.postprocessing = postprocessing;
const isNonEmpty = function (d, ignores) {
    return (!ignores.includes(d) &&
        (typeof d !== 'object' || Object.keys(d).length));
};
function clearJson(obj, ignores = [null, undefined, '', ' '], opts = {}) {
    let node_id = 0;
    const parsed = JSON.parse(JSON.stringify(obj), function (_, v) {
        var _a;
        if (v === null || v === void 0 ? void 0 : v.rule) {
            v.id = node_id;
            node_id++;
        }
        if ((v === null || v === void 0 ? void 0 : v.rule) && ((_a = opts.lowNodes) === null || _a === void 0 ? void 0 : _a.includes(v === null || v === void 0 ? void 0 : v.rule)))
            delete v.children;
        if (!opts.morphemes &&
            (v === null || v === void 0 ? void 0 : v.rule) &&
            /^([A-Z]+[0-9]*|comma\b|comma2\b|period\b|end\b)/.test(v.rule))
            delete v.children;
        if ((v === null || v === void 0 ? void 0 : v.rule) && ['end'].includes(v.rule))
            return;
        if (Array.isArray(v)) {
            v = v.filter(Boolean).flat();
        }
        if ((v === null || v === void 0 ? void 0 : v.children) && !Array.isArray(v.children)) {
            v.children = [v.children];
        }
        try {
            if (v === null || v === void 0 ? void 0 : v.children) {
                if (opts.removeIntermediateNodes)
                    while (v.children &&
                        v.children.length === 1 &&
                        !opts.importantNodes.includes(v.children[0].rule)) {
                        if (!v.children[0].children)
                            break;
                        v.children = v.children[0].children;
                    }
                for (let n in v.children) {
                    if (v.children[n].rule)
                        v.children[n].parent = v.id;
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        if (!isNonEmpty(v, ignores))
            return;
        return v;
    }) || {};
    return parsed;
}
