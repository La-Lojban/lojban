export declare const romoi_lahi_cmaxes: (te_gerna: string) => {
    tcini: string;
    "te spuda": any;
    kampu: any;
};
export declare const cmaxes: ({ te_gerna, versiio, }: {
    te_gerna: string;
    versiio: string;
}) => {
    tcini: string;
    "te spuda": any;
    kampu: any;
};
export declare const jbopomofo: (te_gerna: string) => string;
export declare const rukylermorna: (te_gerna: string) => string;
export declare const krulermorna: (te_gerna: string) => string;
export declare const jvozba: (selcmima: string) => any;
export declare const jvokaha: (valsi: string) => any[];
export declare const jvokaha2: (valsi: string) => any[];
export declare const jvokaha_gui: (valsi: string) => string[];
export declare const rafsi: (valsi: string, jsonDoc?: string, bangu?: string) => {
    rafsi: string[];
    selrafsi: any[];
};
export declare const selmaho: ({ word, jsonDoc, bangu, }: {
    word: string;
    jsonDoc?: string;
    bangu?: string;
}) => any;
export declare const word: ({ word, jsonDoc }: {
    word: string;
    jsonDoc?: string;
}) => any;
export declare const dump: ({ doc, bangu }: {
    bangu?: string;
    doc?: string;
}) => any;
export declare const rafsi_giho_nai_se_rafsi: (valsi: string, jsonDoc?: string, bangu?: string) => {
    rafsi: string[];
    selrafsi: any[];
    valsi: string;
};
export declare const xulujvo: (te_gerna: string) => boolean;
export declare function xugismu(te_gerna: string): boolean;
export declare function ilmentufa_off(te_gerna: any, mode: any, preprocess: any): {
    tcini: string;
    "te spuda": any;
    kampu: any;
};
export declare function ilmentufa_exp(te_gerna: any, mode: any, preprocess: any): {
    tcini: string;
    "te spuda": any;
    kampu: any;
};
export declare const zeizei: (te_gerna: any, returnFullInfo?: any) => any;
export declare const anji: (te_gerna: string) => any;
export declare const modzi: (te_gerna: any, rawOutput: any) => any;
export declare const rotpaci: (te_gerna: string) => string;
export declare const lojban2loglan: (te_gerna: string) => any;
export declare const loglan2lojban: (te_gerna: string) => any;
export declare const gloss: (te_gerna: any, bangu: any, jsonDoc: any, pilno_logentufa: any) => (string | boolean)[];
export declare const wiktionary: (te_gerna: any, bangu: any, akti: any) => void;
