import { TePurciBeFiLaCmaxes } from "../types/index";

function sub(from: RegExp, to: string, text: string): string {
	return text.replace(from, to);
}

function compile(arg: RegExp) {
	return arg;
}

function krulermorna(text: string): string {
	text = sub(/\./, "", text);
	text = sub(/^/, ".", text);
	text = sub(/u([aeiouy])/, "w$1", text);
	text = sub(/i([aeiouy])/, "ɩ$1", text);
	text = sub(/au/, "ḁ", text);
	text = sub(/ai/, "ą", text);
	text = sub(/ei/, "ę", text);
	text = sub(/oi/, "ǫ", text);
	text = sub(/\./, "", text);
	return text;
}

function krulermornaize(words: string[]): string[] {
	return words.map((word) => krulermorna(word));
}

const ipaVits: Record<string, string> = {
	a$: "aː",
	a: "aː",
	//  "e(?=v)": 'ɛːʔ',
	//  "e$": 'ɛːʔ',
	e: "ɛː",
	i: "iː",
	o: "oː",
	u: "ʊu",
	// "u": 'ʊː',
	y: "əː",
	ą: "aɪ",
	ę: "ɛɪ",
	// "ę(?=\b)(?!')": 'ɛɪʔ',
	ǫ: "ɔɪ",
	ḁ: "aʊ",
	ɩa: "jaː",
	ɩe: "jɛː",
	ɩi: "jiː",
	ɩo: "jɔː",
	ɩu: "juː",
	ɩy: "jəː",
	ɩ: "j",
	wa: "waː",
	we: "wɛː",
	wi: "wiː",
	wo: "wɔː",
	wu: "wuː",
	wy: "wəː",
	w: "w",
	c: "ʃ",
	//# "bj": 'bʒ',
	j: "ʒ",
	s: "s",
	z: "z",
	f: "f",
	v: "v",
	x: "hhh",
	"'": "h",
	// "dj":'dʒ',
	// "tc":'tʃ',
	// "dz":'ʣ',
	// "ts":'ʦ',
	r: "ɹ",
	"r(?![ˈaeiouyḁąęǫ])": "ɹɹ",
	// 'r(?=[ˈaeiouyḁąęǫ])': 'ɹ',
	nˈu: "nˈʊuː",
	nu: "nʊuː",
	ng: "ng",
	n: "n",
	m: "m",
	l: "l",
	b: "b",
	d: "d",
	g: "ɡ",
	k: "k",
	p: "p",
	t: "t",
	h: "h",
};

/** IPA mapping variant (exported for potential future use). */
export const ipa_nix = {
	a$: "aː",
	a: "aː",
	// "e(?=v)": 'ɛːʔ',
	// "e$": 'ɛːʔ',
	e: "ɛː",
	i: "iː",
	o: "oː",
	u: "ʊu",
	//"u": 'ʊː',
	y: "əː",
	ą: "aɪ",
	ę: "ɛɪ",
	// "ę(?=\b)(?!')": 'ɛɪʔ',
	ǫ: "ɔɪ",
	ḁ: "aʊ",
	ɩa: "jaː",
	ɩe: "jɛː",
	ɩi: "jiː",
	ɩo: "jɔː",
	ɩu: "juː",
	ɩy: "jəː",
	ɩ: "j",
	wa: "waː",
	we: "wɛː",
	wi: "wiː",
	wo: "wɔː",
	wu: "wuː",
	wy: "wəː",
	w: "w",
	c: "ʃ",
	gj: "gɪʒ",
	bj: "bɪʒ",
	j: "ʒ",
	s: "s",
	z: "z",
	f: "f",
	v: "v",
	x: "hh",
	"'": "h",
	// "dj":'dʒ',
	// "tc":'tʃ',
	// "dz":'ʣ',
	// "ts":'ʦ',
	r: "ɹ",
	"r(?![ˈaeiouyḁąęǫ])": "ɹɹɹɪ",
	// 'r(?=[ˈaeiouyḁąęǫ])': 'ɹ',
	nˈu: "nˈʊuː",
	nu: "nʊuː",
	ng: "ng",
	n: "n",
	m: "m",
	l: "l",
	b: "b",
	d: "d",
	g: "ɡ",
	k: "k",
	p: "p",
	t: "t",
	h: "h",
};

const vowelPattern = compile(/[aeiouyąęǫḁ]/);
const vowelComingPattern = compile(/(?=[aeiouyąęǫḁ])/);
const diphthongComingPattern = compile(/(?=[ąęǫḁ])/);

const questionWords = krulermornaize(["ma", "mo", "xu"]);
const starterWords = krulermornaize(["le", "lo", "lei", "loi"]);
const terminatorWords = krulermornaize(["kei", "ku'o", "vau", "li'u"]);

export function lojban2ipa(
	text: string,
	mode = "vits",
	parser: (text: string) => { tcini: string; "te spuda"?: unknown; kampu: unknown }
): string {
	const parsed = parser(text);
	if (parsed.tcini === "fliba") return "";
	const spuda = (parsed as TePurciBeFiLaCmaxes)["te spuda"];
	if (!Array.isArray(spuda)) return "";
	text = spuda.map((i: [string, string]) => i[1]).join(" ");
	if (mode === "vits") {
		return lojban2ipaVits(text);
	}
	return lojban2ipaVits(text);
}

function lojban2ipaVits(text: string): string {
	text = krulermorna(text.trim());
	const words = text.split(" ");
	const rebuiltWords: string[] = [];
	const questionSentence = false;
	for (let index = 0; index < words.length; index++) {
		const word = words[index];
		if (word === undefined) continue;
		let modifiedWord: string = word;
		let prefix = "",
			postfix = "";

		if (questionWords.includes(word)) {
			postfix = "?";
			prefix = " " + prefix;
		}

		if (starterWords.includes(word)) {
			prefix = " " + prefix;
		}

		if (terminatorWords.includes(word)) {
			postfix = ", ";
		}

		if (index === 0 || words[index] === "ni'o" || words[index] === "i") {
			prefix = ", " + prefix;
		}

		const splitWord = word.split(vowelComingPattern);
		const tailWord = splitWord.slice(-2);
		const t0 = tailWord[0];
		const t1 = tailWord[1];
		const t0first = t0?.[0];
		const t1first = t1?.[0];
		if (
			tailWord.length === 2 &&
			t0 !== undefined && t0.length > 0 &&
			t1 !== undefined && t1.length > 0 &&
			t0first !== undefined && t1first !== undefined &&
			vowelPattern.test(t0first) &&
			vowelPattern.test(t1first)
		) {
			const headWord = splitWord.slice(0, -2);
			modifiedWord = headWord.join("") + "ˈ" + tailWord.join("");
			postfix = postfix + " ";
		} else if (
			tailWord.length === 2 &&
			t0 !== undefined && t0.length > 0 &&
			t1 !== undefined &&
			diphthongComingPattern.test(t1.charAt(0))
		) {
			const headWord = splitWord.slice(0, -2);
			modifiedWord = headWord.join("") + t0 + "ˈ" + t1;
			postfix = postfix + " ";
		}

		const prevWord = words[index - 1];
		if (!(index - 1 >= 0 && prevWord !== undefined && starterWords.includes(prevWord))) {
			prefix = " " + prefix;
		}

		let rebuilt_word: string = "";
		const lit = modifiedWord.split("").entries();
		for (const [idx, x] of lit) {
			const tail = modifiedWord.slice(idx);
			let matched = false;
			let consumed = 1;
			for (const [attr, val] of Object.keys(ipaVits)
				.map((key) => [key, ipaVits[key as keyof typeof ipaVits]])
				.sort((a, b) => (a[0] as string).length - (b[0] as string).length)
				.reverse()) {
				const pattern = new RegExp(`^${attr}`);
				const matches = pattern.exec(tail);
				if (matches) {
					const match = matches[0];
					consumed = match !== undefined ? match.length : 0;
					rebuilt_word += val;
					matched = true;
					break;
				}
			}
			if (!matched) {
				rebuilt_word += x;
			}
			for (let i = 0; i < consumed - 1; i++) {
				lit.next();
			}
		}
		rebuiltWords.push(prefix + rebuilt_word + postfix);
	}

	let output = rebuiltWords.join("").trim();
	output = output.replace(/ {2,}/g, " ");
	output = output.replace(/, ?(?=,)/g, "");

	const lastChar = text.at(-1);
	if (questionSentence) {
		output += "?";
	} else if (lastChar !== undefined && vowelPattern.test(lastChar)) {
		output += ".";
	}
	return output;
}
