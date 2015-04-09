'use strict';
var Env = require('./env.js');
var Eval = require('./eval.js');
var Reader = require('./reader.js');
var Printer = require('./printer.js');
var Tokenizer = require('./tokenizer.js');

/**
 * REPL
 */
function READ(text) { return new Reader(new Tokenizer(text).tokenize()).read_str(); }

function EVAL(ast) { return new Eval(new Env()).run(ast); }

function PRINT(malData) { return new Printer(malData).pr_str(); }

function rep(text) { return PRINT(EVAL(READ(text)));}
/**
 * END REPL
 */



// Add a main loop that repeatedly prints a prompt, gets a line of
// input from the user, calls rep with that line of input, and then
// prints out the result from rep. It should also exit when you send
// it an EOF (often Ctrl-D).
function main() {

    //Set our event handler to start listening to keyboard input.
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (text) {
        if (text === 'quit\r\n') {
            done();
        }
        try {
            rep(text);
        } catch(e) {
            console.log(e);
            console.log('try again');
        }
    });

    // Terminate program if the text 'quit' is sent to STDOUT
    function done() {
        console.log('now that process.stdin is paused,  there is nothing more to do.');
        process.exit();
    }
}

var program = main();
