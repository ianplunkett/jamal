'use strict';

import Type from './Type.js';

// The following regular expression (PCRE) will match all mal tokens.
function Tokenizer(input) {
    let regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/,
        tokens = input.split(regexp),
        filteredTokens = [];
    
    for(let token of tokens) {
        if(token !== '') {
            let typed_token = new Type(token);
            filteredTokens.push(typed_token);
        }
    }
    return filteredTokens;
};

export default Tokenizer;
