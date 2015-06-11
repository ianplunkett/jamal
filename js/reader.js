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
    let atom  = this.next();

    let data_types = {
        "nil"                : /^nil$/,
        "true"               : /^true$/,
        "false"              : /^false$/,
        "digit"              : /^\d+$/,
        "keyword"            : /^:/,
        "string"             : /^".*"$/,
        "quote"              : /^'/,
        "quasiquote"         : /^`/,
        "unquote"            : /^~/,
        "splice-unquote"     : /^~@/,
        "whole-line-comment" : /^;;/,
        "deref"              : /^@/
    };

    
    
    if (data_types.test(atom)) {
        return {integer: parseInt(atom)};
    } else if (data_types.test(atom)){
        
        return {symbol: atom};
    }
};

module.exports = Reader;
