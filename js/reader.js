'use strict';
let Exception = require('./exception.js');

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

//next returns the token at the current position and increments the position.
Reader.prototype.next = function() {
    if (this.position > this.tokens.length) {
        throw new Exception('next: EOF Error - Invalid Syntax');
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
    /** switch on complex types or default to atom processing */
    switch (this.peek()) {
        case '(' || ')':
            /** List */
            return this.read_complex_type('list', ['(', ')']);
        case '[' || ']':
            /** Vector */
            return  this.read_complex_type('vector', ['[', ']']);
            /** Hash Map */
        case '{' || '}':
            return  this.read_complex_type('hashmap', ['{', '}']);
        default:
            return this.read_atom();
    }
};

Reader.prototype.read_complex_type = function(type, delimiters) {
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

    let data_types = {
        
        // Working properly
        "nil"                : /^nil$/,
        "boolean"            : /^true|false$/,
        "integer"            : /^\d+$/,
        "string"             : /^".*"$/,
        "whole-line-comment" : /^;;/,
        "with-meta"          : /^\^/,
        "deref"              : /^@/,

        // Complex data types, treat as key/value pair
        "quote"              : /^'/,
        "quasiquote"         : /^`/,
        "unquote"            : /^~/,
        "splice-unquote"     : /^~@/,
        "comment-after-exp"  : /^;.*$/,

        // TODO: map unicode internal representation 0x29E 
        "keyword"            : /^:/


    };

    for (let regex in data_types) {
        if (data_types.hasOwnProperty(regex) && data_types[regex].test(atom)) {
            obj[regex] = atom;
            return obj;
        }
    }

    return {symbol: atom};

};

module.exports = Reader;
