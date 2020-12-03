#!/usr/bin/env node

var prism = require('prismjs');
var fs = require('fs');
var supportsColor = require('supports-color');

function highjackRenderer (ansi_mapping) {
    (function(Token) {
        if (!ansi_mapping) {
            if (fs.existsSync('~/.prismrc')) {
                ansi_mapping = require('~/.prismrc');
            } else {
                if (supportsColor.has256) {
                    ansi_mapping = {
                        'function': '\x1b[37m',
                        'comment': '\x1b[38;5;241m',
                        'keyword': '\x1b[38;5;31m',
                        'string': '\x1b[38;5;28m',
                        'regex': '\x1b[38;166m',
                        'punctuation': '',
                        'operator': '',
                        'number': '\x1b[38;5;160m',
                    };
                } else {
                    ansi_mapping = {
                        'function': '\x1b[1;37m',
                        'comment': '\x1b[36m',
                        'keyword': '\x1b[01;34m',
                        'string': '\x1b[1;32m',
                        'regex': '\x1b[1;33m',
                        'punctuation': '',
                        'operator': '',
                        'number': '\x1b[01;31m'
                    };
                }
            }
        }
        var _ = prism;
        _.Token = function(type, content, alias, matchedStr, greedy) {
            Token.apply(this, [].slice.call(arguments));
        };

        _.Token.stringify = function(o, language, parent, newlines) {
            if (typeof o == 'string') {
                return o;
            }

            if (_.util.type(o) === 'Array') {
                return o.map(function(element) {
                    return _.Token.stringify(element, language, o, newlines);
                }).join('');
            }

            var env = {
                type: o.type,
                content: _.Token.stringify(o.content, language, parent, newlines),
                tag: 'span',
                classes: ['token', o.type],
                attributes: {},
                language: language,
                parent: parent
            };

            _.hooks.run('wrap', env);
            function format(string) {
                return ansi_mapping[env.type] + string + '\x1b[0m';
            }
            if (typeof ansi_mapping[env.type] != 'undefined') {
                if (newlines) {
                    return env.content.split('\n').map(format).join('\n');
                } else {
                    return format(env.content);
                }
            } else {
                return env.content;
            }
        };
    })(prism.Token);
}

function higlight(text, language, { html, newlines, grammar, colors } = {}) {
    if (!html) {
        highjackRenderer(colors);
    }
    if (grammar) {
        prism.languages[language] = grammar;
    } else {
        grammar = prism.languages[language];
    }
    if (!grammar) {
        try {
            require('prismjs/components/prism-' + language + '.min.js');
            grammar = prism.languages[language];
        } catch(e) {
            var languages = Object.keys(require('prismjs/components.js').languages);
            throw new Error('Unknown language ' + language +
                            ', available languages are ' +
                            languages.join(', '));
        }
    }
    var tokens = prism.tokenize(text, grammar);
    var string = prism.Token.stringify(tokens, language, undefined, newlines);
    if (html) {
        string = '<pre class="language-' + language + '">' + string + '</pre>';
    }
    return string;
}


module.exports = higlight;
