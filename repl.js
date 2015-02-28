'use strict';
var util = require('util');
var Reader = require('./reader.js');
var Printer = require('./printer.js');
var Tokenizer = require('./tokenizer.js');


/**
 * REPL
 */
function READ(text) {
    let tokens = new Tokenizer(text).tokenize();
    return new Reader(tokens);
}

function EVAL(eval_r) { return eval_r; }

function PRINT(malData) {
    console.log(malData);
    return new Printer(malData).pr_str();
}

function rep(text) {
    PRINT(EVAL(READ(text)));
}
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
        rep(text);
        if (text === 'quit\r\n') {
            done();
        }
    });

    // Terminate program if the text 'quit' is sent to STDOUT
    function done() {
        console.log('now that process.stdin is paused,  there is nothing more to do.');
        process.exit();
    }
}

var program = main();
