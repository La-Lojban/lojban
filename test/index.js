// console.log(lojban.krulermorna('coi ro do'));
// console.log(lojban.rukylermorna('coi ro do'));
// console.log(lojban.romoi_lahi_cmaxes('coi ro do'));

const chai = require('chai'),
    should = chai.should(),
    chai_expect = chai.expect,
    lojban = require('../index')
;

describe('#krulermorna', function() {
  it('transliterates \"coi ro do\" into \"cǫ ro do\"', function() {
    lojban.krulermorna('coi ro do').should.equal('cǫ ro do');
  });
});

describe('#rukylermorna', function() {
  it('transliterates "mu sofybakni cu zvati le purdi" into "му софыбакни шу звати лэ пурди"', function() {
    lojban.rukylermorna('mu sofybakni cu zvati le purdi').should.equal('му софыбакни шу звати лэ пурди');
  });
});

describe('#romoi_lahi_cmaxes', function() {
  it('parses \'coi ro do\' as \'[["cmavo","coi"],["space"," "],["cmavo","ro"],["space"," "],["cmavo","do"]\']', function() {
    JSON.stringify(lojban.romoi_lahi_cmaxes('coi ro do')).should.equal('[["cmavo","coi"],["space"," "],["cmavo","ro"],["space"," "],["cmavo","do"]]');
  });
});
 
describe('#jvozba', function() {
  it('builds from array \'["lujvo","zbasu"]\' the array of lujvo equal to \'jvozba\'', function() {
    JSON.stringify(lojban.jvozba(["lujvo","zbasu"])).should.equal("[{\"lujvo\":\"jvozba\",\"score\":5858},{\"lujvo\":\"luvzba\",\"score\":5878},{\"lujvo\":\"jvozbas\",\"score\":6888},{\"lujvo\":\"luvzbas\",\"score\":6908},{\"lujvo\":\"jvozbasu\",\"score\":7897},{\"lujvo\":\"luvzbasu\",\"score\":7917},{\"lujvo\":\"lujvyzba\",\"score\":8008},{\"lujvo\":\"lujvyzbas\",\"score\":9038},{\"lujvo\":\"lujvyzbasu\",\"score\":10047}]");
  });
});
 
describe('#jvokaha2', function() {
  it('should split \'fu\'ivla\' as [ \'fu\\\'i\', \'r\', \'vla\' ]', function() {
    JSON.stringify(lojban.jvokaha2("fu'irvla")).should.equal('["fu\'i","r","vla"]');
  });
});

describe('#xulujvo', function() {
  it('should confirm that \'fu\'ivla\' is true (for being a lujvo)', function() {
    JSON.stringify(lojban.xulujvo("fu'irvla")).should.equal('true');
  });
});

describe('#jvokaha_gui', function() {
  it('should split \'fu\'ivla\' as \'["fukpi","valsi"]\'', function() {
    JSON.stringify(lojban.jvokaha_gui("fu'ivla")).should.equal('["fukpi","valsi"]');
  });
});

describe('#ilmentufa_off', function() {
  it('should parse "coi ro do" in MTC mode by default', function() {
    JSON.stringify(lojban.ilmentufa_off("coi ro do")).should.equal("\"([COI: {c o i>} [{<PA: (¹r o]¹) BOI> {KOhA: <d o¹)>} DOhU]\"");
  });
});

describe('#ilmentufa_exp', function() {
  it('should parse "coi ro do" in MTC mode by default', function() {
    JSON.stringify(lojban.ilmentufa_exp("coi ro do")).should.equal("\"(COI:coi [{PA:ro BOI> KOhA:do} DOhU]\"");
  });
});

describe('#zeizei', function() {
  it('should parse "lonu muvgau broda cumo" as "lo nu muvdu zei gasnu broda cu mo"', function() {
    lojban.zeizei("lonu muvgau broda cumo").should.equal("lo nu muvdu zei gasnu broda cu mo");
  });
});

describe('#lojban2loglan', function() {
  it('should translate "lo prenu ca klama ti" into "le pernu na godzi ti"', function() {
    lojban.lojban2loglan("lo prenu ca klama ti").should.equal("le pernu na godzi ti");
  });
});

describe('#loglan2lojban', function() {
  it('should translate "le pernu na godzi ti" into "lo prenu ca klama ti"', function() {
    lojban.loglan2lojban("le pernu na godzi ti").should.equal("lo prenu ca klama ti");
  });
});

describe('#gloss', function() {
  it('should gloss "coi ro do" as "hello each-of you"', function() {
    lojban.gloss("coi ro do").join(" ").should.equal("hello each-of you");
  });
});

describe('#zmifanva', function() {
  it('should zmifanva for "coi ro do" as "Hi, everybody."', function() {
    return lojban.zmifanva("coi ro do","jb2en")
    .then(function(m) { chai_expect(m).to.equal('Hi, everybody.');})
        .catch(function(m) { throw new Error((m) + '// was not supposed to fail'); })
            ;
  });
});

describe('#wiktionary', function() {
  it('should wiktionary for "coi" as "coi\nCmavo: hello, greetings\n"', function() {
    lojban.wiktionary("coi","Lojban",function(m){chai_expect(m).to.equal('coi\nCmavo: hello, greetings\n');});
  });
});

describe('#rafsi_giho_nai_se_rafsi_gui', function() {
  it('should output for "pu\'u" the string ""', function() {
    JSON.stringify(lojban.rafsi_giho_nai_se_rafsi_gui("pu'u")).should.equal("{\"valsi\":\"pu'u\",\"rafsi\":[\"puv\"],\"serafsi\":\"sputu\"}");
  });
});
