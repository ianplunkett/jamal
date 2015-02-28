'use strict';
var util = require('util');

/**
 * REPL
 */
function READ(text) { return new Reader(text).read_str(); }

function EVAL(eval_r) { return eval_r; }

function PRINT(malData) { return new Printer(malData).pr_str(); }

function rep(text) {
    let input = READ(text);
    let output = EVAL(input);
    let print = PRINT(output);
}
/**
 * END REPL
 */

function Symbol(atom) {
    console.log(atom);
    this.atom = atom;
    return this;
}


function Printer(malData) {
    this.malData = malData;
    return this;
}

Printer.prototype.pr_str = function() {
    console.log(this.malData);
};

function Reader(tokenString) {
    this.tokens = [];
    this.tokenString = tokenString;
    this.position = 0;
    return this;
}
//next returns the tokens at the current position and increments the position.
Reader.prototype.next = function() {
    this.position++;
    var tokens = this.tokens[this.position];
    return tokens;
};

//peek just returns the token at the current position.
Reader.prototype.peek = function() {
    return this.tokens[this.position];
};

Reader.prototype.read_str = function() {
    this.tokens = Tokenizer(this.tokenString);
    return this.read_form();
};

Reader.prototype.read_form = function() {
    let token = this.next();
    let malData = [];
    if (token === '(') {
        malData = this.read_list();
    } else {
        malData = this.read_atom();
    }
    return malData;
};

Reader.prototype.read_list = function() {
    var list = [];
    var token = this.peek();
    console.log(token);
    while (token !== ')') {
        if(token === "") {
            token = this.next();
            continue;
        }
        list.push(token);
        token = this.read_form();
    }
    list.push(token);
    return list;
};

Reader.prototype.read_atom = function() {
    var atom  = this.next();
    var regexp = /\d+/;
    if (regexp.test(atom)) {
        return parseInt(atom);
    } else {
        //        return new Symbol(atom);
        return atom;
    }
};


// The following regular expression (PCRE) will match all mal tokens.
function Tokenizer(input) {
    var regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/;
    var tokens = input.split(regexp);
    return tokens;
};

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
