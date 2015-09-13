'use strict';

import Core      from './Core.js';
import Env       from './Env.js';
import Eval      from './Eval.js';
import Printer   from './Printer.js';
import Reader    from './Reader.js';
import Tokenizer from './Tokenizer.js';


function READ(text) { return (new Reader(new Tokenizer(text))).read_str(); }

function EVAL(ast, env) { return new Eval(ast, env); }

function PRINT(malData) { return new Printer(malData).pr_str(); }

function rep(text, env) { return PRINT(EVAL(READ(text),env)); }

function main() {

    let env = Core(new Env()),
        readline = require('readline'),
        rl = readline.createInterface(process.stdin, process.stdout, '', false);

    rl.setPrompt('user> ');
    rl.prompt();

//    rep(env, '(def! not (fn* (a) (if a false true)))');
    rl.on('line', function(line) {
        try {
            console.log(rep(line, env));
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
