#!/usr/bin/env node

var prism = require('prismjs');
var colors = require('ansi-256-colors');
var fs = require('fs');

(function(Token) {
    var ansi_mapping;
    if (fs.existsSync('~/.prismrc')) {
        ansi_mapping = require('~/.prismrc');
    } else {
        ansi_mapping = {
            'function': colors.fg.getRgb(0,2,3),
            'comment': colors.fg.grayscale[9],
            'keyword': colors.fg.getRgb(0,2,3),
            'string': colors.fg.getRgb(0,2,0),
            'punctuation': '',
            'operator': '',
            'number': colors.fg.getRgb(4,1,0)
        };
    }
    var _ = prism;
    _.Token = function(type, content, alias, matchedStr, greedy) {
        Token.apply(this, [].slice.call(arguments));
    };
    _.Token.stringify = function(o, language, parent) {
        if (typeof o == 'string') {
            return o;
        }

        if (_.util.type(o) === 'Array') {
            return o.map(function(element) {
                return _.Token.stringify(element, language, o);
            }).join('');
        }

        var env = {
            type: o.type,
            content: _.Token.stringify(o.content, language, parent),
            tag: 'span',
            classes: ['token', o.type],
            attributes: {},
            language: language,
            parent: parent
        };

        _.hooks.run('wrap', env);

        if (typeof ansi_mapping[env.type] != 'undefined') {
            return ansi_mapping[env.type] + env.content + colors.reset;
        } else {
            return env.content;
        }
    };
})(prism.Token);

function higlight(text, language) {
    var grammar = prism.languages[language];
    if (!grammar) {
        try {
            require('prismjs/components/prism-' + language);
            grammar = prism.languages[language];
        } catch(e) {
            throw new Error('Uknown language ' + language);
        }
    }
    var tokens = prism.tokenize(text, grammar);
    return prism.Token.stringify(tokens, language);
}

var argv = require('optimist').argv;

if (argv.l) {
    var language = argv.l;
    function format(chunk) {
        if (chunk !== null) {
            try {
                process.stdout.write(higlight(chunk.toString(), language));
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
    process.stdout.write('usage: prism -f {file} -l {language}\n\n' +
                         'if file is missing the source to highlight is taken from stdin');
}
