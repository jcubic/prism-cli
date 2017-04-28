## Prims-cli

Prism-cli is small script for highlighting of source code files from command line

It use awesome [prism](https://github.com/PrismJS/prism) library by Lea Verou and support all languages that prism support but not all tokens are supported, ANSI colors are handled by [ansi-256-colors](https://github.com/jbnicolai/ansi-256-colors)

[![npm](https://img.shields.io/badge/npm-0.1.0-blue.svg)](https://www.npmjs.com/package/prism-cli)

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
prism -l {LANGUAGE} -f {FILENAME} | less -R
```

## Contribution

If use some language that lack of token handlers you can create Pull Request, I will happly merge.


## License

Licensed under [MIT](http://opensource.org/licenses/MIT) license

Copyright (c) 2017 [Jakub Jankiewicz](http://jcubic.pl/jakub-jankiewicz)
