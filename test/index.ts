import * as lojban from "../src/index";

describe("#ipa", () => {
	it('transliterates "coirodo" into ", ʃˈɔɪ ɹoː doː."', () => {
		expect(
			lojban.lojban2ipa("coirodo", "vits", lojban.romoi_lahi_cmaxes)
		).toBe(", ʃˈɔɪ ɹoː doː.");
	});
});

describe("#krulermorna", () => {
	it('transliterates "coi ro do" into "cǫ ro do"', () => {
		expect(lojban.krulermorna("coi ro do")).toBe("cǫ ro do");
	});
});

describe("#tibetan", () => {
	it('transliterates "lojban" into "ལོཞྦན྄"', () => {
		expect(lojban.tibetan("lojban")).toBe("ལོཞྦན྄");
	});
});

describe("#rukylermorna", () => {
	it('transliterates "mu sofybakni cu zvati le purdi" into "Му софыба́кни шу зва́ти лэ пу́рди."', () => {
		expect(
			lojban.rukylermorna("mu sofybakni cu zvati le purdi")
		).toBe("Му софыба́кни шу зва́ти ле пу́рди.");
	});
});

describe("#romoi_lahi_cmaxes", () => {
	it('parses \'coi ro do\' as expected', () => {
		expect(JSON.stringify(lojban.romoi_lahi_cmaxes("coi ro do")["te spuda"])).toBe(
			'[["cmavo","coi"],["drata"," "],["cmavo","ro"],["drata"," "],["cmavo","do"]]'
		);
	});
});

describe("#jvozba", () => {
	it("builds from array [\"lujvo\",\"zbasu\"] the array of lujvo equal to 'jvozba'", () => {
		expect(JSON.stringify(lojban.jvozba(["lujvo", "zbasu"]))).toBe(
			'[{"lujvo":"jvozba","score":5858},{"lujvo":"luvzba","score":5878},{"lujvo":"jvozbas","score":6888},{"lujvo":"jvozbasu","score":7897},{"lujvo":"luvzbasu","score":7917},{"lujvo":"lujvyzba","score":8008},{"lujvo":"luvyzbas","score":8008},{"lujvo":"lujvyzbas","score":9038},{"lujvo":"lujvyzbasu","score":10047}]'
		);
	});
});

describe("#jvokaha2", () => {
	it("splits 'fu'ivla' as [ 'fu\\'i', 'r', 'vla' ]", () => {
		expect(JSON.stringify(lojban.jvokaha2("fu'irvla"))).toBe(
			'["fu\'i","r","vla"]'
		);
	});
	it("splits 'ambulance' as [ 'ambulance' ]", () => {
		expect(JSON.stringify(lojban.jvokaha2("ambulance"))).toBe('["ambulance"]');
	});
});

describe("#xulujvo", () => {
	it("confirms that 'fu'ivla' is true (for being a lujvo)", () => {
		expect(JSON.stringify(lojban.xulujvo("fu'irvla"))).toBe("true");
	});
});

describe("#jvokaha_gui", () => {
	it("splits 'xojyka'a' into ['-xoj-','katna']", () => {
		expect(JSON.stringify(lojban.jvokaha_gui("xojyka'a"))).toBe(
			'["-xoj-","katna"]'
		);
	});
	it("splits 'fu'ivla' as [\"fukpi\",\"valsi\"]", () => {
		expect(JSON.stringify(lojban.jvokaha_gui("fu'ivla"))).toBe(
			'["fukpi","valsi"]'
		);
	});
	it("splits 'nunyjmive' as [\"nu\",\"jmive\"]", () => {
		expect(JSON.stringify(lojban.jvokaha_gui("nunyjmive"))).toBe(
			'["nu","jmive"]'
		);
	});
});

describe("#ilmentufa_off", () => {
	it('parses "coi ro do" in MTC mode by default', async () => {
		const r = await lojban.ilmentufa_off("coi ro do");
		expect(JSON.stringify(r["te spuda"])).toBe(
			'"([COI: {c o i}] [{<PA: (¹r o¹)> BOI} {KOhA: <d o>}] DOhU)"'
		);
	});
});

describe("#ilmentufa_exp", () => {
	it('parses "coi ro do" in MTC mode by default', async () => {
		const r = await lojban.ilmentufa_exp("coi ro do");
		expect(JSON.stringify(r["te spuda"])).toBe(
			'"([COI: {c o i}] [{<PA: (¹r o¹)> BOI} {KOhA: <d o>}] DOhU)"'
		);
	});
});

describe("#zeizei", () => {
	it('parses "lonu muvgau broda cumo" as "lo nu muvdu zei gasnu broda cu mo"', () => {
		expect(lojban.zeizei("lonu muvgau broda cumo")).toBe(
			"lo nu muvdu zei gasnu broda cu mo"
		);
	});
});

describe("#lojban2loglan", () => {
	it('translates "lo prenu ca klama ti" into "su pernu na godzi ti"', () => {
		expect(lojban.lojban2loglan("lo prenu ca klama ti")).toBe(
			"su pernu na godzi ti"
		);
	});
});

describe("#loglan2lojban", () => {
	it('translates "le pernu na godzi ti" into "le prenu ca klama ti"', () => {
		expect(lojban.loglan2lojban("le pernu na godzi ti")).toBe(
			"le prenu ca klama ti"
		);
	});
});

describe("#gloss", () => {
	jest.setTimeout(12000);
	it('glosses "coi ro do" as "hello each-of you"', async () => {
		const result = await lojban.gloss("coi ro do", "en", undefined, false);
		expect(result.join(" ")).toBe("hello each-of you");
	});
});

describe("#rafsi_giho_nai_se_rafsi", () => {
	jest.setTimeout(12000);
	it('outputs for "pu\'u" the expected object', () => {
		expect(JSON.stringify(lojban.rafsi_giho_nai_se_rafsi("pu'u"))).toBe(
			'{"valsi":"pu\'u","rafsi":["puv"],"selrafsi":["sputu"]}'
		);
	});
	it('outputs for "doi" the expected object', () => {
		expect(JSON.stringify(lojban.rafsi_giho_nai_se_rafsi("doi"))).toBe(
			'{"valsi":"doi","rafsi":[],"selrafsi":["do"]}'
		);
	});
	it('outputs for "bloti" the expected object', () => {
		expect(JSON.stringify(lojban.rafsi_giho_nai_se_rafsi("bloti"))).toBe(
			'{"valsi":"bloti","rafsi":["lot","blo","lo\'i","blot"],"selrafsi":[]}'
		);
	});
	it('outputs for "mi" the expected object', () => {
		expect(JSON.stringify(lojban.rafsi_giho_nai_se_rafsi("mi"))).toBe(
			'{"valsi":"mi","rafsi":["mib"],"selrafsi":[]}'
		);
	});
});

describe("#jbopomofo", () => {
	it('transliterates "coi" into Bopomofo characters', () => {
		expect(lojban.jbopomofo("coi")).toContain("ㄕ");
		expect(lojban.jbopomofo("a")).toBe("ㄚ");
	});
});

describe("#cmaxes", () => {
	it('parses valid text with default versiio', () => {
		const r = lojban.cmaxes({ te_gerna: "coi ro do" });
		expect(r.tcini).toBe("snada");
		expect(JSON.stringify(r["te spuda"])).toBe(
			'[["cmavo","coi"],["drata"," "],["cmavo","ro"],["drata"," "],["cmavo","do"]]'
		);
	});
	it('returns fliba for invalid input', () => {
		const r = lojban.cmaxes({ te_gerna: "xxx invalid <<<", versiio: "index" });
		expect(r.tcini).toBe("fliba");
		expect(r["te spuda"]).toBeTruthy();
	});
});

describe("#romoi_lahi_cmaxes fliba", () => {
	it('returns fliba for ungrammatical input', () => {
		const r = lojban.romoi_lahi_cmaxes("zzz zzz zzz");
		expect(r.tcini).toBe("fliba");
		expect(typeof r["te spuda"]).toBe("string");
	});
});

describe("#jvokaha", () => {
	it("splits valid lujvo 'jvozba' into rafsi", () => {
		expect(JSON.stringify(lojban.jvokaha("jvozba"))).toBe('["jvo","zba"]');
	});
	it("throws for malformed lujvo", () => {
		expect(() => lojban.jvokaha("notalujvo")).toThrow(
			/malformed lujvo|You need at least two valsi to make a lujvo/
		);
	});
});

describe("#preprocessing", () => {
	it("normalizes apostrophe and digits", () => {
		expect(lojban.preprocessing("1")).toBe("pa");
		expect(lojban.preprocessing("'")).toBe("'");
	});
	it("returns error for non-string input", () => {
		expect(lojban.preprocessing(123 as unknown as string)).toBe("ERROR: Wrong input type.");
	});
});

describe("#rotpaci", () => {
	it("ROT13-encodes Latin letters", () => {
		expect(lojban.rotpaci("ab")).toBe("no");
		expect(lojban.rotpaci("coi")).toBe("pbv");
	});
});

describe("#anji", () => {
	it("converts Lojban to Chinese characters (jbopomofo) for fu'ivla/cmevla", () => {
		const r = lojban.anji("coi ro do");
		expect(typeof r).toBe("string");
		expect(r.length).toBeGreaterThan(0);
	});
});

describe("#modzi", () => {
	it("converts Lojban to Morse-like representation", () => {
		const r = lojban.modzi("coi ro do");
		expect(typeof r).toBe("string");
		expect(r.length).toBeGreaterThan(0);
	});
	it("returns raw output when rawOutput is true", () => {
		expect(lojban.modzi("coi", true)).toBe("coi");
	});
});

describe("#xugismu", () => {
	it("returns true for gismu 'klama'", () => {
		expect(lojban.xugismu("klama")).toBe(true);
	});
	it("returns false for non-gismu", () => {
		expect(lojban.xugismu("coi")).toBe(false);
	});
});

describe("#lojban2ipa default", () => {
	it("uses default parser when gentufa not passed", () => {
		const r = lojban.lojban2ipa("coi");
		expect(typeof r).toBe("string");
		expect(r).toContain("ʃ");
	});
});

describe("#zeizei returnFullInfo", () => {
	it("returns full info array when returnFullInfo is true", () => {
		const r = lojban.zeizei("coi ro do", true);
		expect(Array.isArray(r)).toBe(true);
		expect(r.length).toBeGreaterThan(0);
	});
});

describe("#dump", () => {
	it("returns dictionary doc for en (uses included assets/dumps/en.json)", () => {
		const doc = lojban.dump({ bangu: "en" });
		expect(doc).toBeTruthy();
		expect(doc.dictionary).toBeTruthy();
	});
});

describe("#word", () => {
	jest.setTimeout(12000);
	it("returns word entries for known word (uses included dump when jsonDoc omitted)", () => {
		const words = lojban.word({ word: "coi" });
		expect(Array.isArray(words)).toBe(true);
		expect(words.length).toBeGreaterThan(0);
	});
});

describe("#selmaho", () => {
	jest.setTimeout(12000);
	it("returns selmaho info for cmavo", () => {
		const r = lojban.selmaho({ word: "COI", bangu: "en" });
		expect(r).toHaveProperty("full");
		expect(r).toHaveProperty("partial");
		expect(r).toHaveProperty("CLL");
	});
});

describe("#rafsi", () => {
	jest.setTimeout(12000);
	it("returns rafsi and selrafsi for gismu", () => {
		const r = lojban.rafsi("bloti", undefined, "en");
		expect(r).toHaveProperty("rafsi");
		expect(r).toHaveProperty("selrafsi");
		expect(r.rafsi).toContain("lot");
	});
});
