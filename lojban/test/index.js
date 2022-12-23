const chai = require("chai"),
	should = chai.should(),
	chai_expect = chai.expect,
	lojban = require("../dist/index");

describe("#ipa", function () {
	it('transliterates "coirodo" into ", ʃˈɔɪ ɹoː doː."', function () {
		lojban
			.lojban2ipa("coirodo", "vits", lojban.romoi_lahi_cmaxes)
			.should.equal(", ʃˈɔɪ ɹoː doː.");
	});
});

describe("#krulermorna", function () {
	it('transliterates "coi ro do" into "cǫ ro do"', function () {
		lojban.krulermorna("coi ro do").should.equal("cǫ ro do");
	});
});

describe("#rukylermorna", function () {
	it('transliterates "mu sofybakni cu zvati le purdi" into "му софыбакни шу звати лэ пурди"', function () {
		lojban
			.rukylermorna("mu sofybakni cu zvati le purdi")
			.should.equal("му софыбакни шу звати лэ пурди");
	});
});

describe("#romoi_lahi_cmaxes", function () {
	it('parses \'coi ro do\' as \'[["cmavo","coi"],["drata"," "],["cmavo","ro"],["drata"," "],["cmavo","do"]]\'', function () {
		JSON.stringify(
			lojban.romoi_lahi_cmaxes("coi ro do")["te spuda"]
		).should.equal(
			'[["cmavo","coi"],["drata"," "],["cmavo","ro"],["drata"," "],["cmavo","do"]]'
		);
	});
});

describe("#jvozba", function () {
	it("builds from array '[\"lujvo\",\"zbasu\"]' the array of lujvo equal to 'jvozba'", function () {
		JSON.stringify(lojban.jvozba(["lujvo", "zbasu"])).should.equal(
			'[{"lujvo":"jvozba","score":5858},{"lujvo":"luvzba","score":5878},{"lujvo":"jvozbas","score":6888},{"lujvo":"luvzbas","score":6908},{"lujvo":"jvozbasu","score":7897},{"lujvo":"luvzbasu","score":7917},{"lujvo":"lujvyzba","score":8008},{"lujvo":"lujvyzbas","score":9038},{"lujvo":"lujvyzbasu","score":10047}]'
		);
	});
});

describe("#jvokaha2", function () {
	it("should split 'fu'ivla' as [ 'fu\\'i', 'r', 'vla' ]", function () {
		JSON.stringify(lojban.jvokaha2("fu'irvla")).should.equal(
			'["fu\'i","r","vla"]'
		);
	});
});

describe("#jvokaha2", function () {
	it("should split 'ambulance' as [ 'ambulance' ]", function () {
		JSON.stringify(lojban.jvokaha2("ambulance")).should.equal('["ambulance"]');
	});
});

describe("#xulujvo", function () {
	it("should confirm that 'fu'ivla' is true (for being a lujvo)", function () {
		JSON.stringify(lojban.xulujvo("fu'irvla")).should.equal("true");
	});
});

describe("#jvokaha_gui", function () {
	it("should split 'xojyka'a' into ['-xoj-','katna']", function () {
		JSON.stringify(lojban.jvokaha_gui("xojyka'a")).should.equal(
			'["-xoj-","katna"]'
		);
	});
});

describe("#jvokaha_gui", function () {
	it("should split 'fu'ivla' as '[\"fukpi\",\"valsi\"]'", function () {
		JSON.stringify(lojban.jvokaha_gui("fu'ivla")).should.equal(
			'["fukpi","valsi"]'
		);
	});
});

describe("#jvokaha_gui", function () {
	it("should split 'nunyjmive' as '[\"nu\",\"jmive\"]'", function () {
		JSON.stringify(lojban.jvokaha_gui("nunyjmive")).should.equal(
			'["nu","jmive"]'
		);
	});
});

describe("#ilmentufa_off", function () {
	it('should parse "coi ro do" in MTC mode by default', function () {
		JSON.stringify(lojban.ilmentufa_off("coi ro do")["te spuda"]).should.equal(
			'"([COI: {c o i}] [{<PA: (¹r o¹)> BOI} {KOhA: <d o>}] DOhU)"'
		);
	});
});

describe("#ilmentufa_exp", function () {
	it('should parse "coi ro do" in MTC mode by default', function () {
		JSON.stringify(lojban.ilmentufa_exp("coi ro do")["te spuda"]).should.equal(
			'"([COI: {c o i}] [{<PA: (¹r o¹)> BOI} {KOhA: <d o>}] DOhU)"'
		);
	});
});

describe("#zeizei", function () {
	it('should parse "lonu muvgau broda cumo" as "lo nu muvdu zei gasnu broda cu mo"', function () {
		lojban
			.zeizei("lonu muvgau broda cumo")
			.should.equal("lo nu muvdu zei gasnu broda cu mo");
	});
});

describe("#lojban2loglan", function () {
	it('should translate "lo prenu ca klama ti" into "su pernu na godzi ti"', function () {
		lojban
			.lojban2loglan("lo prenu ca klama ti")
			.should.equal("su pernu na godzi ti");
	});
});

describe("#loglan2lojban", function () {
	it('should translate "le pernu na godzi ti" into "le prenu ca klama ti"', function () {
		lojban
			.loglan2lojban("le pernu na godzi ti")
			.should.equal("le prenu ca klama ti");
	});
});

describe("#gloss", function () {
	this.timeout(12000);
	it('should gloss "coi ro do" as "hello each-of you"', function () {
		lojban
			.gloss("coi ro do", "en", false, false)
			.join(" ")
			.should.equal("hello each-of you");
	});
});

describe("#wiktionary", function () {
	it('should wiktionary for "coi" as "coi\nCmavo: hello, greetings\n"', function () {
		lojban.wiktionary("coi", "Lojban", function (m) {
			chai_expect(m).to.equal("coi\nCmavo: hello, greetings\n");
		});
	});
});

describe("#rafsi_giho_nai_se_rafsi", function () {
	this.timeout(12000);
	it('should output for "pu\'u" the string ""', function () {
		JSON.stringify(lojban.rafsi_giho_nai_se_rafsi("pu'u")).should.equal(
			'{"valsi":"pu\'u","rafsi":["puv"],"selrafsi":["sputu"]}'
		);
	});
});

describe("#rafsi_giho_nai_se_rafsi", function () {
	this.timeout(12000);
	it('should output for "doi" the string \'{"valsi":"doi","rafsi":[],"selrafsi":["do"]}\'', function () {
		JSON.stringify(lojban.rafsi_giho_nai_se_rafsi("doi")).should.equal(
			'{"valsi":"doi","rafsi":[],"selrafsi":["do"]}'
		);
	});
});

describe("#rafsi_giho_nai_se_rafsi", function () {
	this.timeout(12000);
	it('should output for "bloti" the string "lot,lo\'i"', function () {
		JSON.stringify(lojban.rafsi_giho_nai_se_rafsi("bloti")).should.equal(
			'{"valsi":"bloti","rafsi":["lot","blo","lo\'i","blot"],"selrafsi":[]}'
		);
	});
});

describe("#rafsi_giho_nai_se_rafsi", function () {
	this.timeout(12000);
	it('should output for "mi" the string "{"valsi":"mi","rafsi":["mib"],"selrafsi":[]}"', function () {
		JSON.stringify(lojban.rafsi_giho_nai_se_rafsi("mi")).should.equal(
			'{"valsi":"mi","rafsi":["mib"],"selrafsi":[]}'
		);
	});
});
