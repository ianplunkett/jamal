'use strict';
// The following regular expression (PCRE) will match all mal tokens.
function Tokenizer(input) {
    this.input = input;
    this.regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/;
    return this;
};

Tokenizer.prototype.tokenize = function() {
    let tokens = this.input.split(this.regexp);
    return tokens;
};

module.exports = Tokenizer;
