## Prims-cli

Prism-cli is small script for highlighting of source code files from command line

It use awesome [PrismJS](https://github.com/PrismJS/prism) library by Lea Verou and support all languages that prism support,
but not all tokens are supported, ANSI colors are handled by [ansi-256-colors](https://github.com/jbnicolai/ansi-256-colors).

[![npm](https://img.shields.io/badge/npm-0.3.1-blue.svg)](https://www.npmjs.com/package/prism-cli)

## Preview

![Terminal with JavaScript Code in color](https://github.com/jcubic/prism-cli/blob/master/assets/screenshot.png?raw=true)


## Installation

```
npm install -g prism-cli
```

## Usage

```
cat {FILENAME} | prism -l {LANGAUGE}
```

or

```
prism -l {LANGUAGE} -f {FILENAME}
```

if you want to use less you need to use -R option:

```
prism --color=256 -l {LANGUAGE} -f {FILENAME} | less -R
```

You need --color option because of [detection of 256 colors](https://github.com/chalk/supports-color) don't work in less because it's not real terminal. If your terminal don't support 256 colors you can use --color without argument.

If for some reason you need ANSI formatting for each line, like when you have long multiline comments and you use tail or head to get only few lines you can use -n option to have ANSI formatting on each line:

```
prism -l {LANGUAGE} -f {FILENAME} -n | tail -n 10
```

If you need to get the html code instead of the terminal output you can pass the `--html` parameter

```
prism -l {LANGUAGE} -f {FILENAME} --html
```

## Node.js module

You can also use it as node.js module and highlight the text in your app.

var highlight = require('prism-cli');

```javascript
console.log(hightlight('function(x) { return x * x; }', 'javascript'));
```

There is also 3rd optional argument to hightlight function which is `newline` flag same as -n in command line.

## Config file

If you don't like default colors you can use `~/.prismrc` file that should be node module with exported object,
that have PrismJS tokens that map to ASNI escapes.

Example mapping for 256 color supported terminals:

```javascript
ansi_mapping = {
  'function': '\x1b[37m',
  'comment': '\x1b[38;5;241m',
  'keyword': '\x1b[38;5;31m',
  'string': '\x1b[38;5;28m',
  'punctuation': '',
  'operator': '',
  'number': '\x1b[38;5;166m',
};
```

List of all PrismJS tokens can be found in PrismJS source code in
[prism.css](https://github.com/PrismJS/prism/blob/f941102ef59897052a1e60887f90b9818433fbb0/themes/prism.css#L69-L139).

## Contribution

If use some language that lack of colors for prism token you can create Pull Request, I will happly merge.


## Contributors

- [Jakub T. Jankiewicz](https://jcubic.pl/jakub-jankiewicz)
- [Martin Heidegger](https://github.com/martinheidegger)

## License

Licensed under [MIT](http://opensource.org/licenses/MIT) license

Copyright (c) 2017 [Jakub T. Jankiewicz](https://jcubic.pl/jakub-jankiewicz)
