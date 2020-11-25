#!/usr/bin/env node

var higlight = require('..');
var fs = require('fs');
var lily = require('@jcubic/lily');

var argv = lily(process.argv.slice(2), {boolean: ['html', 'n']});

if (argv.l) {
    var language = argv.l;
    function format(chunk) {
        if (chunk !== null) {
            try {
                process.stdout.write(higlight(chunk.toString(), language, {
                    html: argv.html,
                    newlines: argv.n
                }));
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
