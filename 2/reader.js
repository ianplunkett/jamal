'use strict';
let Exception = require('./exception.js');

function Reader(tokens) {
    this.tokens = tokens;
    this.position = 0;
    return this;
}

Reader.prototype.read_str = function() {
    let programData = this.read_form();
    if(this.tokens.length !== this.position) {
        throw new Exception('EOF Error - Invalid Syntax');
    }
    return programData;
};

//next returns the token at the current position and increments the position.
Reader.prototype.next = function() {
    if (this.position > this.tokens.length) {
        throw new Exception('EOF Error - Invalid Syntax');
    }
    var token = this.tokens[this.position];
    this.position++;
    return token;
};

//peek just returns the token at the current position.
Reader.prototype.peek = function() {
    return this.tokens[this.position];
};

Reader.prototype.read_form = function() {
    let token = this.peek(),
        malData = [];
    if (token === '(') {
        malData = this.read_list();
    } else {
        malData = this.read_atom();
    }
    console.log(malData);
    return malData;
};

Reader.prototype.read_list = function() {
    let list = [],
        token = this.next();

    while (token !== ')') {
        if (token !== '(') {
            list.push(token);
        }
        token = this.read_form();
    }
    return list;
};

Reader.prototype.read_atom = function() {
    let atom  = this.next();
    let regexp = /^\d+$/;
    if (regexp.test(atom)) {
        return parseInt(atom);
    } else {
        return atom;
    }
};

module.exports = Reader;
