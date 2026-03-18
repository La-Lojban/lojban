import * as R from "ramda";
import { jvokaha_gui as jvokaha_gui_local } from "../sozysozbot_jvozba";
import { cllk } from "./cll";
/** Included dictionary dump (same role as the old en.xml): used by dump/word/selmaho/rafsi/gloss when no custom doc is passed. */
import enJsonRaw from "../../assets/dumps/en.json";

/** Lensisku API export entry shape (en/json) */
interface LensiskuEntry {
	word: string;
	word_type?: string;
	selmaho?: string;
	definition?: string;
	notes?: string;
	rafsi?: string;
	gloss_keywords?: Array<{ word: string; meaning?: string | null }>;
	place_keywords?: Array<{ word: string; meaning?: string | null }>;
}

function normalizeLensisku(entries: unknown): ValsiEntry[] {
	if (!Array.isArray(entries)) return [];
	return (entries as LensiskuEntry[]).map((e) => {
		const rafsiRaw = e.rafsi;
		let rafsi: string | string[] | undefined;
		if (typeof rafsiRaw === "string") {
			const arr = rafsiRaw.split(/\s+/).map((s) => s.trim()).filter(Boolean);
			rafsi = arr.length <= 1 ? (arr[0] ?? undefined) : arr;
		}
		const glossWord = e.gloss_keywords?.[0]?.word;
		const placeKeywords = e.place_keywords?.map((k) => ({ word: k.word, place: "1" as const }));
		return {
			word: e.word,
			selmaho: e.selmaho,
			rafsi,
			notes: e.notes,
			type: e.word_type?.replace(/fu'ivla/, "fuhivla"),
			glossword: glossWord != null ? { word: glossWord } : undefined,
			keyword: placeKeywords?.length ? placeKeywords : undefined,
		};
	});
}

type TargetElem = {
	processed?: boolean;
	word?: string;
	processedWord?: string | null;
};

const items: {
	[key: string]:
		| string
		| ((array: Array<TargetElem>, index: number) => TargetElem[]);
} = {
	a: "and/or",
	ba: "in-future",
	"bu'u": "at",
	ca: "at-present",
	"co'a": "become",
	"co'o": "goodbye",
	coi: "hello",
	dansu: "dance(s)",
	"dansu@n": "dancer(s)",
	doi: "oh",
	"e'a": "[permission-granted]",
	"e'u": "I-suggest",
	e: "and",
	"e,nai": "and-not",
	"gi'e": (array: Array<TargetElem>, index: number) => {
		let ind = index - 1;
		const el = array[ind]!;
		array[ind] = {
			...el,
			processedWord: (el.processedWord ?? el.word) + ",",
		};
		ind = index;
		array[ind] = { ...array[ind]!, processedWord: "and" };
		return array;
	},
	"gi'a": (array: Array<TargetElem>, index: number) => {
		let ind = index - 1;
		const el = array[ind]!;
		array[ind] = {
			...el,
			processedWord: (el.processedWord ?? el.word) + ",",
		};
		ind = index;
		array[ind] = { ...array[ind]!, processedWord: "and/or" };
		return array;
	},
	"gi'u": (array: Array<TargetElem>, index: number) => {
		let ind = index - 1;
		const el = array[ind]!;
		array[ind] = {
			...el,
			processedWord: (el.processedWord ?? el.word) + ",",
		};
		ind = index;
		array[ind] = { ...array[ind]!, processedWord: "whether-or-not" };
		return array;
	},
	gu: "whether-or-not",
	ie: "yeah",
	ja: "and/or",
	"je'a": "indeed",
	je: "and",
	"je,nai": "and-not",
	ju: "whether-or-not",
	"ka'e": "possibly-can",
	ka: "being",
	klama: "come(s)",
	"klama@n": "comer",
	ko: "do-it-so-that-you",
	ku: (array: Array<TargetElem>, index: number) => {
		const el = array[index - 1]!;
		array[index - 1] = {
			...el,
			processedWord: (el.processedWord ?? el.word) + ",",
		};
		return array;
	},
	la: (array: Array<TargetElem>, index: number) => {
		const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
		array[index] = { ...array[index]!, processedWord: "📛" };
		const next = array[index + 1]!;
		array[index + 1] = {
			...next,
			processedWord: capitalize(next.processedWord ?? next.word ?? ""),
		};

		return array;
	},
	le: "the",
	lo: "those-which",
	ma: "what",
	me: "among",
	mi: "me", //dont copy
	mlatu: "is-a-cat",
	"mlatu@n": "cat",
	mo: "is-what",
	"na'e": "not",
	na: "not",
	nai: "-not",
	nelci: "fond-of",
	noi: (array: Array<TargetElem>, index: number) => {
		const el = array[index - 1]!;
		array[index - 1] = {
			...el,
			processedWord: (el.processedWord ?? el.word) + ", which",
		};
		return array;
	},
	poi: (array: Array<TargetElem>, index: number) => {
		const el = array[index - 1]!;
		array[index - 1] = {
			...el,
			processedWord: (el.processedWord ?? el.word) + " that",
		};
		return array;
	},
	nu: "event-of",
	oi: "ouch",
	"pa'o": "through",
	"pe'i": "in-my-opinion",
	pe: "that-is-related-to",
	pei: "?",
	pu: "in-past",
	ra: "recently-mentioned",
	"re'u": "time",
	ro: "each-of",
	roi: "times",
	slabu: "is-familiar-to",
	"tu'a": "about",
	"u'u": "sorry",
	u: "whether-or-not",
	ui: "yay",
	"ui,nai": "unfortunately",
	vau: (array: Array<TargetElem>, index: number) => {
		const el = array[index - 1]!;
		array[index - 1] = {
			...el,
			processedWord: (el.processedWord ?? el.word) + "]",
		};
		return array;
	},
	xu: "is-it-true-that",
	"xu,nai": "isnt-it-so-that",
	"za'a": "as-I-can-see",
	"za'a,dai": "as-you-can-see",
	"zo'u": ":",
	zo: "the-word:",
	//["bakni","is-a-cow"],
};

const universalItems: Record<string, string> = {
	"ba'e": "NB! =>",
	bo: "><",
	zei: "><",
	cai: "!!!",
	cu: ":",
	da: "X",
	de: "Y",
	di: "Z",
	"fa'o": "∎",
	fa: "¹",
	fe: "²",
	fi: "³",
	fo: "⁴",
	fu: "⁵",
	i: "§",
	jo: "⇔",
	"li'u": "”",
	lu: "“",
	"na'e": "!",
	na: "!",
	"ni'o": "¶",
	si: "✎",
	sa: "✎",
	su: "✎",
	sai: "!",
	se: "1⇔2",
	te: "1⇔3",
	ve: "1⇔4",
	xe: "1⇔5",
};

export interface ValsiEntry {
	word?: string;
	selmaho?: string;
	rafsi?: string | string[];
	notes?: string;
	type?: string;
	keyword?: { word?: string; place?: string } | Array<{ word?: string; place?: string }>;
	glossword?: { word?: string } | Array<{ word?: string }>;
}
interface DictDirection {
	valsi: ValsiEntry[];
}

type DictionaryInput =
	| { dictionary: { direction: DictDirection[] | DictDirection } }
	| { valsi: ValsiEntry[] }
	| LensiskuEntry[];

function getDictionaryDirection(dictionary: DictionaryInput): DictDirection {
	if (dictionary && typeof dictionary === "object" && "dictionary" in dictionary) {
		const d = (dictionary as { dictionary: { direction: DictDirection[] | DictDirection } }).dictionary.direction;
		return (Array.isArray(d) ? d[0] : d) as DictDirection;
	}
	if (Array.isArray(dictionary)) {
		return { valsi: normalizeLensisku(dictionary) };
	}
	if (dictionary && typeof dictionary === "object" && "valsi" in dictionary) {
		return dictionary as DictDirection;
	}
	return { valsi: [] };
}

export function fastParse({
	doc,
	bangu: _lang,
}: {
	doc: unknown;
	bangu?: string;
}): Record<string, unknown> {
	if (doc && typeof doc === "object") return doc as Record<string, unknown>;
	// Default: use included dump (assets/dumps/en.json); expose as legacy shape so doc.dictionary exists
	const arr = enJsonRaw as unknown;
	const valsi = Array.isArray(arr) ? normalizeLensisku(arr) : [];
	return { dictionary: { direction: [{ valsi }] } } as Record<string, unknown>;
}

type ParserResult = { tcini: string; kampu: unknown };
export async function gloss(
	text: string,
	lang = "en",
	parser: ((t: string, _mode?: string, _flag?: boolean) => Promise<ParserResult> | ParserResult) | false | null,
	dictionary: unknown
): Promise<string[]> {
	text = text.replace(/"/g, "");
	dictionary = fastParse({ doc: dictionary, bangu: lang });
	if (parser) {
		const parsed = await Promise.resolve(parser(text, "T", true));
		if (parsed.tcini !== "snada") return ["di'u na gendra"];
		const kampu = parsed["kampu"];
		if (typeof kampu !== "string") return ["di'u na gendra"];
		text = kampu
			.replace(/\bLIhU\b/gm, "li'u")
			.replace(/,/g, " ")
			.replace(/\b[A-Z]+h[A-Z]+[0-9]*[a-z]*\b/g, "")
			.replace(/[^a-z'. ]/g, "")
			.replace(/ {2,}/gm, " ")
			.trim();
	}
	const tokens = text.split(" ");

	let target: Array<string> = tokens.slice();
	type LookupValue = string | ((array: Array<TargetElem>, index: number) => TargetElem[]);
	let lookupItems: Array<[Array<string>, LookupValue]> = [];
	if (lang === "en")
		Object.keys(items).forEach((i: string) => {
			lookupItems.push([i.split(","), items[i]!]);
		});
	Object.keys(universalItems).forEach((i) => {
		if (lookupItems.filter(([key]) => key.join(",") == i).length === 0)
			lookupItems.push([i.split(","), universalItems[i]!]);
	});
	let targetProcessed = target.map(
		(i) => ({ processed: false, word: i } as TargetElem)
	);
	const lookupItemVersions = [
		{
			type: "string",
			value: lookupItems.filter(([, value]) => typeof value === "string"),
		},
		{
			type: "function",
			value: lookupItems.filter(([, value]) => typeof value === "function"),
		},
	];
	for (const lookupSubset of lookupItemVersions) {
		for (let j = 0; j < target.length; j++) {
			const word = target[j];
			const match = lookupSubset.value
				.filter(
					([key]) =>
						JSON.stringify(target.slice(j, j + key.length)) ===
						JSON.stringify(key)
				)
				.sort((a, b) => (a[0].length >= b[0].length ? -1 : -1))[0];

			if (match) {
				const [key, value] = match;
				if (typeof value === "function") {
					targetProcessed = value(targetProcessed, j);
				} else
					targetProcessed[j] = {
						...targetProcessed[j],
						processed: true,
						processedWord: value,
					};

				for (let j_ = j + 1; j_ <= j + key.length - 1; j_++) {
					targetProcessed[j_] = {
						...targetProcessed[j_],
						processed: true,
						processedWord: null,
					};
				}
				j += key.length - 1;
				continue;
			}
			if (lookupSubset.type === "string") {
				let glossWord;
				const entries = getDictionaryDirection(dictionary as DictionaryInput).valsi.filter((v) => v.word === word);
				if (entries[0]) {
					const v = entries[0];
					glossWord =
						R.path(["glossword", "word"], v) ||
						R.path(["glossword", 0, "word"], v) ||
						R.path(["keyword", "word"], v);
					if (!glossWord && v.keyword && Array.isArray(v.keyword)) {
						const c = v.keyword.filter(
							(k) => k.word === word && k.place === "1"
						);
						if (c[0]) glossWord = c[0].word;
					}
				}

				if (glossWord != null && typeof glossWord === "string") {
					targetProcessed[j] = {
						...targetProcessed[j],
						processed: true,
						processedWord: glossWord.replace(/ /g, "-"),
					};
				} else {
					//now try if it's lujvo
					const w = target[j];
					const selrafsi = w !== undefined ? jvokaha_gui_local(w) : null;
					if (selrafsi && selrafsi.length >= 2) {
						const lujvo_gloss = await gloss(
							selrafsi.join(" "),
							lang,
							parser,
							dictionary
						);

						targetProcessed[j] = {
							...targetProcessed[j],
							processed: true,
							processedWord: lujvo_gloss.join("-"),
						};
					}
				}
			}
		}
	}
	//deal with non-processed elements
	const prettifiedTarget = targetProcessed
		.filter((elem): elem is TargetElem & { processedWord: string } => elem.processedWord !== null)
		.map((elem) => {
			if (!elem.processed) elem.processedWord = (elem.word ?? "") + "*";
			return elem.processedWord;
		});
	return prettifiedTarget;
}

export const word = ({
	word,
	jsonDoc: dictionary,
	bangu: lang,
}: {
	word: string;
	jsonDoc: unknown;
	bangu?: string;
}) => {
	lang = lang ?? "en";
	dictionary = fastParse({ doc: dictionary, bangu: lang });
	const words = getDictionaryDirection(dictionary as DictionaryInput).valsi.filter((v) => v.word === word);
	return words;
};

export const selmaho = ({
	word,
	jsonDoc: dictionary,
	bangu: lang,
}: {
	word: string;
	jsonDoc?: unknown;
	bangu?: string;
}) => {
	lang = lang ?? "en";
	dictionary = fastParse({ doc: dictionary, bangu: lang });
	word = word.toLowerCase();
	const r: { full: string[]; partial: string[]; CLL: string | null } = { full: [], partial: [], CLL: null };
	getDictionaryDirection(dictionary as DictionaryInput).valsi.forEach(
		(v) => {
			if (v.selmaho && v.word !== undefined) {
				if (v.selmaho.toLowerCase() === word) r.full.push(v.word);
				else if (
					v.selmaho.toLowerCase().search(new RegExp(`${word}[\\d]+`)) === 0
				)
					r.partial.push(v.word);
			}
		}
	);
	const cllarr = cllk[word];
	if (cllarr) r.CLL = cllarr;
	return r;
};

export const rafsi = (
	word: string,
	dictionary: unknown,
	xugismu: (arg0: string) => boolean,
	lang: string
) => {
	lang = lang || "en";
	dictionary = fastParse({ doc: dictionary, bangu: lang });
	let rafsi: string[] = [];
	let selrafsi = [];
	const entries = getDictionaryDirection(dictionary as DictionaryInput).valsi;
	for (const v of entries) {
		if (v.word === word) {
			if (v.rafsi) {
				if (Array.isArray(v.rafsi)) {
					rafsi = rafsi.concat(v.rafsi);
				} else {
					rafsi.push(v.rafsi);
				}
			}
			const match = (v.notes || "").match(/^.*? -([a-z']+)-.*/);
			if (match && match[1]) rafsi.push(match[1]);
			if (v.type && v.type.indexOf("fuhivla") >= 0) rafsi.push(v.word + "'y");
		}
		if (v.rafsi) {
			if (
				(Array.isArray(v.rafsi) && v.rafsi.includes(word)) ||
				v.rafsi === word
			) {
				selrafsi.push(v.word);
			}
		} else if ((v.notes || "").search(new RegExp(`^.*? -(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})-.*`)) >= 0)
			selrafsi.push(v.word);
	}
	if (word.substr(0, 4) !== "brod" && xugismu(word)) {
		rafsi.push(word.substr(0, 4));
	}
	return { rafsi, selrafsi };
};

export const rafsi_giho_nai_se_rafsi = (
	word: string,
	dictionary: unknown,
	xugismu: (arg0: string) => boolean,
	lang?: string
) => {
	return {
		valsi: word,
		...rafsi(word, dictionary, xugismu, lang ?? "en"),
	};
};
