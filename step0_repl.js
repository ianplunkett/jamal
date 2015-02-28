var util = require('util');

function READ() {}

function EVAL() {}

function PRINT() {}

function rep(text) {
    console.log(util.inspect(text));
}

// Add a main loop that repeatedly prints a prompt, gets a line of
// input from the user, calls rep with that line of input, and then
// prints out the result from rep. It should also exit when you send
// it an EOF (often Ctrl-D).
function main() {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (text) {
        rep(text);
        if (text === 'quit\r\n') {
            done();
        }
    });

    function done() {
        console.log('now htat process.stdin is paused,  there is nothing more to do.');
        process.exit();
    }
    /*
    var prompt = require('prompt');
    prompt.start();

    prompt.get(['input'], function (err, result) {

        if (err) {
            return onErr(err);
        }
        console.log('Command-line input received:');
        console.log('input:' + result.input);
        return 0;
    });
     */
}

var program = main();
        /*
    while(true) {
    }
     */

