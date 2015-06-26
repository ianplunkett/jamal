'use strict';
let Exception = require('./exception.js'),
    Type = require('./type.js');

function Reader(tokens) {
    this.tokens = tokens,
    this.position = 0;
    return this;
}

Reader.prototype.read_str = function() {
    let programData = this.read_form();
    if(this.tokens.length !== this.position) {
        throw new Exception('read_str: EOF Error - Invalid Syntax');
    }
    return programData;
};

/** next returns the token at the current position and increments the position. */
Reader.prototype.next = function() {
    if (this.position > this.tokens.length) {
        throw new Exception('next: EOF Error - Invalid Syntax');
    }
    var token = this.tokens[this.position];
    this.position++;
    return token;
};

/** peek just returns the token at the current position. */
Reader.prototype.peek = function() {
    return this.tokens[this.position];
};

Reader.prototype.read_form = function() {

    /** switch on complex types or default to atom processing */
    let current_token = this.peek(),
        typed_token = new Type(current_token);
    
    switch (typed_token.form) {
        case 'list':
            /** List Form */
            return this.list(typed_token);
            /** Key Value Form */
        case 'pair':
            return this.pair(typed_token);
        default:
            /** Atom Form */
            return this.atom(typed_token);
    }
};

Reader.prototype.pair = function(typed_token) {
    let list = [],
	token = this.next();

    list.push(typed_token.value);
    token = this.read_form();
    list.push(token);
    return list;
};

Reader.prototype.list = function(typed_token) {
    let list = [],
        obj = {},
        token = this.next(),
	type = typed_token.value;
    
    while (true) {
        if (token.symbol === typed_token.end) {
            break;
        } else if (token !== typed_token.begin) {
            list.push(token);
        }
        token = this.read_form();
    }

    obj[type] = list;
    return obj;
};

Reader.prototype.atom = function(typed_token) {

    // Increment to the next token, but throw it on the ground. We
    // already have the typed token.
    this.next();
    return typed_token.value;

};

module.exports = Reader;
