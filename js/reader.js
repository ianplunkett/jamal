'use strict';
let Exception = require('./exception.js'),
    Type = require('./types.js');

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
            return this.complex_type(typed_token);
            /** Key Value Form */
        case 'key-value-pair':
            return this.key_value_pair(typed_token);
        default:
            /** Atom Form */
            return typed_token.ast;
    }
};

Reader.prototype.key_value_pair = function() {

};

Reader.prototype.complex_type = function(type, delimiters) {
    let list = [],
        obj = {},
        token = this.next();
    
    while (true) {
        if (token.symbol === delimiters[1]) {
            break;
        } else if (token !== delimiters[0]) {
            list.push(token);
        }
        token = this.read_form();
    }

    obj[type] = list;
    return obj;
};

Reader.prototype.read_atom = function() {

    // TODO: move these data types out into their own module for shared access 

    let atom  = this.next(),
        obj   = {};

    let data_types = new Types();
    for (let regex in data_types) {
        if (data_types.hasOwnProperty(regex) && data_types[regex].test(atom)) {
            obj[regex] = atom;
            return obj;
        }
    }

    return {symbol: atom};

};

module.exports = Reader;
