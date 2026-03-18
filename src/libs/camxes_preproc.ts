const cyrillicAlphabetMap: Record<string, string> = { "Ё": "IO", "Й": "I", "Ц": "TS", "У": "U", "К": "K", "Е": "E", "Н": "N", "Г": "G", "Ш": "C", "Щ": "C", "З": "Z", "Х": "X", "Ъ": "Y", "Ь": "'", "ё": "io", "й": "i", "ц": "ts", "у": "u", "к": "k", "е": "e", "н": "n", "г": "g", "ш": "c", "щ": "c", "з": "z", "х": "x", "ъ": "y", "ь": "'", "Ф": "F", "Ы": "Y", "В": "V", "А": "a", "П": "P", "Р": "R", "О": "O", "Л": "L", "Д": "D", "Ж": "J", "Э": "E", "ф": "f", "ы": "y", "в": "v", "а": "a", "п": "p", "р": "r", "о": "o", "л": "l", "д": "d", "ж": "j", "э": "e", "Я": "IA", "Ч": "TC", "С": "S", "М": "M", "И": "I", "Т": "T", "Б": "B", "Ю": "IU", "я": "ia", "ч": "tc", "с": "s", "м": "m", "и": "i", "т": "t", "б": "b", "ю": "iu" };

const transliterate = (word: string): string =>
  word.split("").map((char) => cyrillicAlphabetMap[char] ?? char).join("");

/**
 * Normalize text for parsing (digits, apostrophes, etc.).
 * Accepts arbitrary input; returns the normalized string or "ERROR: Wrong input type." for non-string input.
 */
export const preprocessing = (input: unknown): string => {
	const val =
		typeof input === "object" && input !== null && "valueOf" in input
			? (input as { valueOf(): unknown }).valueOf()
			: input;
	if (typeof val !== "string") {
		return "ERROR: Wrong input type.";
	}
	let text = val;
	text = text.replace(/’/gm, "'");
	text = text.replace(/[^\x20-\x7E]+/g, "");
	text = text.replace(/·/gm, ".");
	text = text.replace(/\u00AD/gm, "");
	text = text.replace(/([0-9])\.([0-9])/gm, "$1 pi $2");
	text = text.replace(/0/gm, "no");
	text = text.replace(/1/gm, "pa");
	text = text.replace(/2/gm, "re");
	text = text.replace(/3/gm, "ci");
	text = text.replace(/4/gm, "vo");
	text = text.replace(/5/gm, "mu");
	text = text.replace(/6/gm, "xa");
	text = text.replace(/7/gm, "ze");
	text = text.replace(/8/gm, "bi");
	text = text.replace(/9/gm, "so");
	// --- //
	text = text.replace(/[áàâä]/g, "A");
	text = text.replace(/[éèêë]/g, "E");
	text = text.replace(/[íìîïĭị]/g, "I");
	text = text.replace(/[óòôö]/g, "O");
	text = text.replace(/[úùûüŭụw]/g, "U");
	text = text.replace(/[ýỳŷÿ]/g, "Y");
	// --- //
	text = text.replace(/sh/igm, "c");
	text = text.replace(/zh/igm, "j");
	text = text.replace(/ch/igm, "tc");
	text = text.replace(/kh/igm, "x");
	// --- //
	text = text.replace(/ı/igm, "i");
	text = text.replace(/ʃ/igm, "c");
	text = text.replace(/ʒ/igm, "j");
	text = text.replace(/ɛ/gm, "e");
	text = text.replace(/(?:Ɛ|ɛ́|ɛ̀|ɛ̂|ɛ̈)/gm, "E");
	text = text.replace(/ə/igm, "y");
	text = text.replace(/ŋ/igm, "ng");
	// --- //
	text = text.replace(/([cfkpstx])([bdgjvz])/igm, "$1y$2");
	text = text.replace(/([bdgjvz])([cfkpstx])/igm, "$1y$2");
	// --- //

	text = transliterate(text);
	// --- //
	text = text.replace(/\(|\)|«|»|‹|›|—|:/gm, "");
	return text;
};
