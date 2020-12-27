const exp_rafsi = true;
require('./tools.js')();
require('./jvozba.js')();
require('./jvokaha.js')();
require('./rafsi_list.js')();
require('./scoring.js')();

module.exports = {
  jvozba: b => jvozba(b),
  jvokaha: b => jvokaha(b),
  jvokaha2: b => jvokaha2(b),
  search_selrafsi_from_rafsi2: b => search_selrafsi_from_rafsi2(b),
  jvokaha_gui: (b) => jvokaha_gui(b,module.exports.search_selrafsi_from_rafsi2),
}