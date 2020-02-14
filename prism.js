#!/usr/bin/env node

var prism = require('prismjs');
var fs = require('fs');
var supportsColor = require('supports-color');
var _ansi_mapping;

function getAnsiMapping () {
    if (_ansi_mapping === undefined) {
        if (fs.existsSync('~/.prismrc')) {
            _ansi_mapping = require('~/.prismrc');
        } else {
            if (supportsColor.has256) {
                _ansi_mapping = {
                    'function': '\x1b[37m',
                    'comment': '\x1b[38;5;241m',
                    'keyword': '\x1b[38;5;31m',
                    'string': '\x1b[38;5;28m',
                    'punctuation': '',
                    'operator': '',
                    'number': '\x1b[38;5;166m',
                };
            } else {
                _ansi_mapping = {
                    'function': '\x1b[1;37m',
                    'comment': '\x1b[36m',
                    'keyword': '\x1b[01;34m',
                    'string': '\x1b[1;32m',
                    'punctuation': '',
                    'operator': '',
                    'number': '\x1b[01;31m'
                };
            }
        }
    }
    return _ansi_mapping;
}

function stringify (o, language, parent) {
    if (typeof o == 'string') {
        return o;
    }

    if (prism.util.type(o) === 'Array') {
        return o.map(function(element) {
            return stringify(element, language, o);
        }).join('');
    }

    var env = {
        type: o.type,
        content: stringify(o.content, language, parent),
        tag: 'span',
        classes: ['token', o.type],
        attributes: {},
        language: language,
        parent: parent
    };

    prism.hooks.run('wrap', env);
    const ansi_mapping = getAnsiMapping()
    function format(string) {
        return ansi_mapping[env.type] + string + '\x1b[0m';
    }
    if (typeof ansi_mapping[env.type] != 'undefined') {
        if (argv.n) {
            return env.content.split('\n').map(format).join('\n');
        } else {
            return format(env.content);
        }
    } else {
        return env.content;
    }
}

function higlight(text, language, cli) {
    var grammar = prism.languages[language];
    if (!grammar) {
        try {
            require('prismjs/components/prism-' + language + '.min.js');
            grammar = prism.languages[language];
        } catch(e) {
            throw new Error('Unknown language ' + language + ', available languages are ' + Object.keys(require('prismjs/components.js').languages).join(', '));
        }
    }
    var tokens = prism.tokenize(text, grammar);
    if (!cli) {
        return '<pre class="language-' + language + '">' + prism.Token.stringify(tokens, language) + '</pre>'
    }
    return stringify(tokens, language)
}

var argv = require('optimist').argv;

if (argv.l) {
    var language = argv.l;
    function format(chunk) {
        if (chunk !== null) {
            try {
                process.stdout.write(higlight(chunk.toString(), language, argv.html !== true));
            } catch(e) {
                process.stderr.write(e.message + "\n");
            }
        }
    }
    if (argv.f) {
        var filename = argv.f;
        fs.readFile(filename, function(err, data) {
            if (err) {
                process.stdout.write(err.message);
            } else {
                format(data);
            }
        });
    } else {
        process.stdin.on('readable', function() {
            format(process.stdin.read())
        });
    }
} else {
    process.stdout.write('usage: prism [-f {file}] [-n] [--html] -l {language}\n\n' +
                         '-f if file option is missing the source to high' +
                         'lightis taken from stdin\n-n use this option if' +
                         ' you want to have ANSI formatting on each line ' +
                         'for multiline tokens line long comments\n-html ' +
                         'use this option if you want the output as html ' +
                         'code instead of terminal colors');
}
