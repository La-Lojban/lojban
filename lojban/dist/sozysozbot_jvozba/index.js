"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jvozba = exports.jvokaha_gui = exports.jvokaha2 = exports.jvokaha = exports.search_selrafsi_from_rafsi2 = void 0;
const rafsi_list_1 = require("./rafsi_list");
const morphology_1 = require("./morphology");
const exp_rafsi = true;
function create_every_possibility(aa) {
    const arr_arr = JSON.parse(JSON.stringify(aa));
    if (arr_arr.length === 0) {
        return [[]];
    }
    const arr = arr_arr.pop();
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        const e = arr[i];
        result = result.concat(create_every_possibility(arr_arr).map((f) => {
            return f.concat([e]);
        }));
    }
    return result;
}
function gismu_rafsi_list$(a) {
    if (typeof rafsi_list_1.gismu_rafsi_list[a] !== "undefined") {
        return rafsi_list_1.gismu_rafsi_list[a];
    }
    if (exp_rafsi) {
        return rafsi_list_1.gismu_rafsi_list_exp[a];
    }
}
function cmavo_rafsi_list$(a) {
    if (rafsi_list_1.cmavo_rafsi_list[a]) {
        return rafsi_list_1.cmavo_rafsi_list[a];
    }
    if (exp_rafsi) {
        return rafsi_list_1.cmavo_rafsi_list_exp[a];
    }
}
// get_candid("bloti", false) ==> ["lot", "blo", "lo'i", "blot"]
// get_candid("gismu", true) ==> ["gim", "gi'u", "gismu", "gism"]
function get_candid(selrafsi, isLast) {
    if (cmavo_rafsi_list$(selrafsi)) {
        return cmavo_rafsi_list$(selrafsi);
    }
    else if (gismu_rafsi_list$(selrafsi)) {
        const gismu = selrafsi;
        const candid = gismu_rafsi_list$(gismu).concat([]);
        if (isLast) {
            candid.push(gismu);
        }
        const chopped = gismu.slice(0, -1);
        if (chopped !== "brod")
            candid.push(chopped);
        return candid;
    }
    else {
        return [];
    }
}
function search_selrafsi_from_rafsi2(rafsi) {
    if (gismu_rafsi_list$(rafsi))
        return rafsi; // 5-letter rafsi
    /*
          I spent 45 minutes trying to find out whether "brod" can be a rafsi for "brodV", but couldn't find that out.
          Thus, for the present I forbid the use of "brod" as a rafsi.
      */
    if (rafsi !== "brod" && rafsi.length === 4 && !rafsi.includes("'")) {
        //4-letter rafsi
        for (let u = 0; u < 5; u++) {
            const gismu_candid = rafsi + "aeiou".charAt(u);
            if (gismu_rafsi_list$(gismu_candid))
                return gismu_candid;
        }
    }
    for (let i in rafsi_list_1.gismu_rafsi_list) {
        if (rafsi_list_1.gismu_rafsi_list[i].includes(rafsi))
            return i;
    }
    for (let j in rafsi_list_1.cmavo_rafsi_list) {
        if (rafsi_list_1.cmavo_rafsi_list[j].includes(rafsi))
            return j;
    }
    if (exp_rafsi) {
        for (let i in rafsi_list_1.gismu_rafsi_list_exp) {
            if (rafsi_list_1.gismu_rafsi_list_exp[i].includes(rafsi))
                return i;
        }
        for (let j in rafsi_list_1.cmavo_rafsi_list_exp) {
            if (rafsi_list_1.cmavo_rafsi_list_exp[j].includes(rafsi))
                return j;
        }
    }
    return null;
}
exports.search_selrafsi_from_rafsi2 = search_selrafsi_from_rafsi2;
function get_lujvo_score(rafsi_ynr_sequence) {
    var lujvo = rafsi_ynr_sequence.join("");
    var L = lujvo.length;
    var A = lujvo.split("'").length - 1;
    var H = 0;
    var R = 0;
    for (var i = 0; i < rafsi_ynr_sequence.length; i++) {
        switch (get_CV_info(rafsi_ynr_sequence[i])) {
            case "C":
            case "Y":
                H++;
                break; // ynr-hyphen
            case "CVCCV":
                R += 1;
                break;
            case "CVCC":
                R += 2;
                break;
            case "CCVCV":
                R += 3;
                break;
            case "CCVC":
                R += 4;
                break;
            case "CVC":
                R += 5;
                break;
            case "CV'V":
                R += 6;
                break;
            case "CCV":
                R += 7;
                break;
            case "CVV":
                R += 8;
                break;
        }
    }
    var V = (lujvo.match(/[aeiou]/g) || []).length;
    return 1000 * L - 500 * A + 100 * H - 10 * R - V;
}
function get_CV_info(v) {
    return v
        .split("")
        .map((c) => {
        if ("aeiou".indexOf(c) !== -1)
            return "V";
        if ("bcdfgjklmnprstvxz".indexOf(c) !== -1)
            return "C";
        if (c === "'")
            return "'";
        if (c === "y")
            return "Y";
    })
        .join("");
}
function jvokaha(lujvo) {
    var arr = jvokaha2(lujvo);
    var rafsi_list = arr.filter(function (a) {
        return a.length !== 1; // remove ynr
    });
    var correct_lujvo = normalize(rafsi_list).join(""); // recreate the lujvo from the rafsi list
    if (lujvo === correct_lujvo) {
        return arr;
    }
    else {
        throw new Error("malformed lujvo {" + lujvo + "}; it should be {" + correct_lujvo + "}");
    }
}
exports.jvokaha = jvokaha;
function jvokaha2(lujvo) {
    var original_lujvo = lujvo;
    var res = [];
    while (true) {
        if (lujvo === "")
            return res;
        //remove hyphen
        if (res.length > 0 && res[res.length - 1].length !== 1) {
            // hyphen cannot begin a word; nor can two hyphens
            if (lujvo.charAt(0) === "y" || // y-hyphen
                lujvo.slice(0, 2) === "nr" || // n-hyphen is only allowed before r
                (lujvo.charAt(0) === "r" && get_CV_info(lujvo.charAt(1)) === "C") // r followed by a consonant
            ) {
                res.push(lujvo.charAt(0));
                lujvo = lujvo.slice(1);
                continue;
            }
        }
        //drop rafsi from front
        //CVV can always be dropped
        if (get_CV_info(lujvo.slice(0, 3)) === "CVV" &&
            ["ai", "ei", "oi", "au"].indexOf(lujvo.slice(1, 3)) !== -1) {
            res.push(lujvo.slice(0, 3));
            lujvo = lujvo.slice(3);
            continue;
        }
        //CV'V can always be dropped
        if (get_CV_info(lujvo.slice(0, 4)) === "CV'V") {
            res.push(lujvo.slice(0, 4));
            lujvo = lujvo.slice(4);
            continue;
        }
        //CVCCY and CCVCY can always be dropped
        //how about checking if CC is persimmisble? *FIXME*
        if (get_CV_info(lujvo.slice(0, 5)) === "CVCCY" ||
            get_CV_info(lujvo.slice(0, 5)) === "CCVCY") {
            res.push(lujvo.slice(0, 4));
            res.push("y");
            lujvo = lujvo.slice(5);
            continue;
        }
        //the final rafsi can be 5-letter
        if (get_CV_info(lujvo) === "CVCCV" || get_CV_info(lujvo) === "CCVCV") {
            res.push(lujvo);
            return res;
        }
        if (get_CV_info(lujvo.slice(0, 3)) === "CVC" ||
            get_CV_info(lujvo.slice(0, 3)) === "CCV") {
            res.push(lujvo.slice(0, 3));
            lujvo = lujvo.slice(3);
            continue;
        }
        // if all fails...
        return [original_lujvo];
    }
}
exports.jvokaha2 = jvokaha2;
function jvokaha_gui(txt) {
    txt = txt.replace(/h/g, "'");
    txt = txt.toLowerCase();
    let arr;
    try {
        arr = jvokaha2(txt);
    }
    catch (e) {
        console.log(e);
        return null;
    }
    arr = arr.filter(function (a) {
        return a.length > 1;
    });
    arr = arr.map(function (rafsi) {
        var selrafsi = search_selrafsi_from_rafsi2(rafsi);
        if (selrafsi) {
            return selrafsi;
        }
        else {
            return "-" + rafsi + "-"; // output as rafsi form; signify as unknown
        }
    });
    return arr;
}
exports.jvokaha_gui = jvokaha_gui;
function jvozba(arr, forbid_la_lai_doi) {
    let candid_arr = [];
    for (let i = 0; i < arr.length; i++) {
        candid_arr.push(get_candid(arr[i], /*isLast:*/ i === arr.length - 1));
    }
    const answers = create_every_possibility(candid_arr)
        .map((rafsi_list) => {
        const result = normalize(rafsi_list);
        return {
            lujvo: result.join(""),
            score: get_lujvo_score(result),
        };
    })
        .filter((d) => {
        const l = d.lujvo;
        return !(is_cmevla(l) &&
            forbid_la_lai_doi &&
            (l.match(/^(lai|doi)/) ||
                l.match(/[aeiouy](lai|doi)/) ||
                l.match(/^la[^u]/) || // the fact that CLL explicitly forbids two sequences `la` and `lai` signifies that `lau` is not forbidden
                l.match(/[aeiouy]la[^u]/)));
    })
        .sort(function (a, b) {
        return a.score - b.score;
    });
    return answers;
}
exports.jvozba = jvozba;
function is_cmevla(valsi) {
    return (valsi.length >= 1 &&
        "aeiouy'".indexOf(valsi.charAt(valsi.length - 1)) === -1);
}
function normalize(rafsi_list) {
    if (rafsi_list.length === 1) {
        throw new Error("You need at least two valsi to make a lujvo");
    }
    var input = rafsi_list.concat([]); //copy
    var result = [input.pop()]; // add the final rafsi
    while (input.length) {
        var rafsi = input.pop();
        var end = rafsi.charAt(rafsi.length - 1);
        var init = result[0].charAt(0);
        if (is_4letter(rafsi)) {
            result.unshift("y");
        }
        else if (get_CV_info(end) === "C" &&
            get_CV_info(init) === "C" &&
            (0, morphology_1.is_permissible)(end, init) === 0) {
            result.unshift("y");
        }
        else if (end === "n" &&
            ["ts", "tc", "dz", "dj"].indexOf(result[0].slice(0, 2)) !== -1) {
            result.unshift("y");
        }
        else if (input.length === 0 && is_CVV(rafsi)) {
            //adapting first rafsi, which is CVV; gotta think about r-hyphen
            var hyphen = "r";
            if (result[0].startsWith("r")) {
                hyphen = "n";
            }
            if (rafsi_list.length > 2 || !is_CCV(result[0])) {
                result.unshift(hyphen);
            }
        }
        else if (input.length === 0 &&
            is_CVC(rafsi) &&
            is_tosmabru(rafsi, result)) {
            result.unshift("y");
        }
        result.unshift(rafsi);
    }
    return result;
}
function is_tosmabru(rafsi, rest) {
    //skip if cmevla
    if (is_cmevla(rest[rest.length - 1])) {
        // ends with a consonant
        return;
    }
    var index;
    for (var i = 0; i < rest.length; i++) {
        if (is_CVC(rest[i]))
            continue;
        index = i;
        if (rest[i] === "y" ||
            (get_CV_info(rest[i]) === "CVCCV" &&
                2 === (0, morphology_1.is_permissible)(rest[i].charAt(2), rest[i].charAt(3)))) {
            break;
            // further testing
        }
        else {
            return false;
        }
    }
    //further testing
    var tmp1 = rafsi;
    var tmp2 = rest[0];
    var j = 0;
    do {
        if (tmp2 === "y")
            return true;
        if (2 !== (0, morphology_1.is_permissible)(tmp1.charAt(tmp1.length - 1), tmp2.charAt(0))) {
            return false;
        }
        tmp1 = tmp2;
        tmp2 = rest[++j];
    } while (j <= index);
    return true;
}
function is_CVV(rafsi) {
    return get_CV_info(rafsi) === "CVV" || get_CV_info(rafsi) === "CV'V";
}
function is_CCV(rafsi) {
    return get_CV_info(rafsi) === "CCV";
}
function is_CVC(rafsi) {
    return get_CV_info(rafsi) === "CVC";
}
function is_4letter(rafsi) {
    return get_CV_info(rafsi) === "CVCC" || get_CV_info(rafsi) === "CCVC";
}
