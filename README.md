## Prims-cli

Prism-cli is small script for highlighting of source code files from command line

It use awesome [prism](https://github.com/PrismJS/prism) library by Lea Verou and support all languages that prism support but not all tokens are supported, ANSI colors are handled by [ansi-256-colors](https://github.com/jbnicolai/ansi-256-colors)

[![npm](https://img.shields.io/badge/npm-0.2.1-blue.svg)](https://www.npmjs.com/package/prism-cli)

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

## Contribution

If use some language that lack of colors for prism token you can create Pull Request, I will happly merge.


## License

Licensed under [MIT](http://opensource.org/licenses/MIT) license

Copyright (c) 2017 [Jakub Jankiewicz](http://jcubic.pl/jakub-jankiewicz)
