'use strict';
let Env = require('./Env.js');
let Eval = require('./Eval.js');
let Printer = require('./Printer.js');
let Reader = require('./Reader.js');
let Tokenizer = require('./Tokenizer.js');

function READ(text) { return (new Reader(new Tokenizer(text))).read_str(); }

function EVAL(env, ast) { return new Eval(env, ast).eval_ast(); }

function PRINT(malData) { return new Printer(malData).pr_str(); }

function rep(env, text) { return PRINT(EVAL(env,READ(text)));}

function bootstrapEnv(env) {

    env.set('+', {
        type: 'arithmetic',
        value: (a,b) => a+b,
        string: '+'
    });
    env.set('-', {
        type: 'arithmetic',
        value: (a,b) => a-b,
        string: '-'
    });

    env.set('*', {
        type: 'arithmetic',
        value: (a,b) => a*b,
        string: '*'
    });

    env.set('/', {
        type: 'arithmetic',
        value: (a,b) => parseInt(a/b),
        string: '/'
    });

    env.set('def!', {
        type: 'special',
        string: 'def!'
    });

    env.set('let*', {
        type: 'special',
        string: 'let*'
    });

    env.set('do', {
        type: 'special',
        string: 'do'
    });

    env.set('if', {
        type: 'special',
        string: 'if'
    });

    env.set('fn*', {
        type: 'special',
        string: 'fn*'
    });
    
    return env;
}

function main() {

    let env = bootstrapEnv(new Env());
    let readline = require('readline'),
        rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt('user> ');
    rl.prompt();

    rl.on('line', function(line) {
        try {
            console.log(rep(env, line));
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
