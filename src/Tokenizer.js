'use strict';
// The following regular expression (PCRE) will match all mal tokens.
function Tokenizer(input) {
    let regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/,
        tokens = input.split(regexp),
        filteredTokens = [];
    
    for(let i = 0; i < tokens.length; i++) {
        if(tokens[i] !== '') {
            filteredTokens.push(tokens[i]);
        }
    }
    return filteredTokens;
};

export default Tokenizer;
