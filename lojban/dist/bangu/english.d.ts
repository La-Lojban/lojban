export declare function fastParse({ doc, bangu }: {
    doc: any;
    bangu?: string;
}): any;
export declare const gloss: (te_gerna: string, bangu: string, gentufa: any, jsonDoc: any) => string | string[];
export declare const wiktionary: (te_gerna: string, vefanva: string, akti: Function) => void;
export declare const word: ({ word, jsonDoc, bangu, }: {
    word: string;
    jsonDoc: any;
    bangu?: string;
}) => any;
export declare const selmaho: ({ word, jsonDoc, bangu, }: {
    word: string;
    jsonDoc: any;
    bangu: string;
}) => any;
export declare const rafsi: (word: string, jsonDoc: any, xugismu: (arg0: any) => any, bangu: string) => {
    rafsi: string[];
    selrafsi: any[];
};
export declare const rafsi_giho_nai_se_rafsi: (word: string, jsonDoc: any, xugismu: any, bangu?: string) => {
    rafsi: string[];
    selrafsi: any[];
    valsi: string;
};
