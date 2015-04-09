'use strict';
let Env = require('./Env.js');
let Eval = require('./Eval.js');
let Printer = require('./Printer.js');
let Reader = require('./Reader.js');
let Tokenizer = require('./Tokenizer.js');

function READ(text) { return (new Reader(new Tokenizer(text))).read_str(); }

function EVAL(ast) { return new Eval(new Env(), ast); }

function PRINT(malData) { return new Printer(malData).pr_str(); }

function rep(text) { return PRINT(EVAL(READ(text)));}

function main() {

    let readline = require('readline'),
        rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt('user>');
    rl.prompt();

    rl.on('line', function(line) {
        try {
            console.log(rep(line));
        } catch(e) {
            console.log(e);
            console.log('try again');
        }
        rl.prompt();
    }).on('close', function() {
        console.log('Have a great day!');
        process.exit(0);
    });
}

main();
