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

const ipa_vits = {
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

const ipa_nix = {
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

const vowel_pattern = compile(/[aeiouyąęǫḁ]/);
const vowel_coming_pattern = compile(/(?=[aeiouyąęǫḁ])/);
const diphthong_coming_pattern = compile(/(?=[ąęǫḁ])/);

const question_words = krulermornaize(["ma", "mo", "xu"]);
const starter_words = krulermornaize(["le", "lo", "lei", "loi"]);
const terminator_words = krulermornaize(["kei", "ku'o", "vau", "li'u"]);

export function lojban2ipa(text: string, mode='vits'): string {
	if (mode === "vits") {
		return lojban2ipa_vits(text);
	}
	return lojban2ipa_vits(text);
}

function lojban2ipa_vits(text: string): string {
	text = krulermorna(text.trim());
	const words = text.split(" ");
	const rebuiltWords: string[] = [];
	let questionSentence = false;
	for (let index = 0; index < words.length; index++) {
		const word = words[index];
		let modifiedWord = word;
		let prefix = "",
			postfix = "";

		if (question_words.includes(word)) {
			postfix = "?";
			prefix = " " + prefix;
		}

		if (starter_words.includes(word)) {
			prefix = " " + prefix;
		}

		if (terminator_words.includes(word)) {
			postfix = ", ";
		}

		if (index === 0 || words[index] === "ni'o" || words[index] === "i") {
			prefix = ", " + prefix;
		}

		const splitWord = word.split(vowel_coming_pattern);
		const tailWord = splitWord.slice(-2);
		if (
			tailWord.length === 2 &&
			tailWord[0].length > 0 &&
			vowel_pattern.test(tailWord[0][0]) &&
			vowel_pattern.test(tailWord[1][0])
		) {
			const headWord = splitWord.slice(0, -2);
			modifiedWord = headWord.join("") + "ˈ" + tailWord.join("");
			postfix = postfix + " ";
		} else if (
			tailWord.length === 2 &&
			tailWord[0].length > 0 &&
			diphthong_coming_pattern.test(tailWord[1][0])
		) {
			const headWord = splitWord.slice(0, -2);
			modifiedWord = headWord.join("") + tailWord[0] + "ˈ" + tailWord[1];
			postfix = postfix + " ";
		}

		if (!(index - 1 >= 0 && starter_words.includes(words[index - 1]))) {
			prefix = " " + prefix;
		}

		let rebuilt_word: string = "";
		const lit = modifiedWord.split("").entries();
		for (const [idx, x] of lit) {
			const tail = modifiedWord.slice(idx);
			let matched = false;
			let consumed = 1;
			for (const [attr, val] of Object.keys(ipa_vits)
				.map((key) => [key, ipa_vits[key as keyof typeof ipa_vits]])
				.sort((a, b) => a[0].length - b[0].length)
				.reverse()) {
				const pattern = new RegExp(`^${attr}`);
				const matches = pattern.exec(tail);
				if (matches) {
					const match = matches[0];
					consumed = match.length;
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

	if (questionSentence) {
		output += "?";
	} else if (vowel_pattern.test(text[text.length - 1])) {
		output += ".";
	}
	return output;
}
