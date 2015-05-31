'use strict';
// The following regular expression (PCRE) will match all mal tokens.
function Tokenizer(input) {
    let regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/;
    let tokens = input.split(regexp);
    let filteredTokens = [];
    for(let i = 0; i < tokens.length; i++) {
        if(tokens[i] !== '') {
            filteredTokens.push(tokens[i]);
        }
    }
    return filteredTokens;
};

module.exports = Tokenizer;
