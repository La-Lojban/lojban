[![npm version](https://badge.fury.io/js/lojban.svg)](https://badge.fury.io/js/lojban)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/La-Lojban/lojban.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FLa-Lojban%2Flojban)
# Lojban language

Lojban language parsers and tools

## Usage
### Install with npm
```
npm install lojban --save
```

[![NPM](https://nodei.co/npm/lojban.png)](https://npmjs.org/packages/lojban/)

### All functions
All supported functions can be seen by running
```
npm test
```

### Lojban alternative orthographies

```JavaScript
const lojban = require('lojban');
console.log(lojban.krulermorna('coi ro do'));//la krulermorna orthography
console.log(lojban.rukylermorna('coi ro do'));//Bulgarian/Russian alphabet orthgraphy
```

### Lojban parsers

romoi_lahi_cmaxes is the latest version of the morphological parser la cmaxes

```JavaScript
const lojban = require('lojban');
console.log(lojban.romoi_lahi_cmaxes('coi ro do')["te spuda"]);
```
`romoi_lahi_cmaxes` object has the following keys:
* "tcini" that has the value "snada" for a grammatically correct input and "fliba" for incorrect input
* "te spuda", the actual parse
* "kampu", a simplified output
