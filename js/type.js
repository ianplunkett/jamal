'use strict';
function Type(token) {

    let types = {
        
        "nil" : {
            form  : 'atom',
            regex : /^nil$/
        },
        "boolean" : {
            form  : 'atom',
            regex : /^true|false$/
        },
        "integer" : {
            form  : 'atom',
            regex : /^\d+$/,
            fn    : char => parseInt(char)
        },
        "string" : {
            form  : 'atom',
            regex : /^".*"$/
        },
        // TODO: map unicode internal representation 0x29E 
        "keyword" : {
            form  : 'atom',
            regex : /^:/,
            fn    : string => string.replace(/:/,'\u029E')
        },
        "whole-line-comment" : {
            form  : 'atom',
            regex : /^;;/
        },

        // Complex data types, treat as key/value pair
        "quote" : {
            form  : 'key-value-pair',
            regex : /^'/
        },
        "quasiquote" : {
            form  : 'key-value-pair',
            regex : /^`/
        },
        "unquote" : {
            form  : 'key-value-pair',
            regex : /^~/
        },
        "splice-unquote" : {
            form  : 'key-value-pair',
            regex : /^~@/
        },
        "comment-after-exp" : {
            form  : 'key-value-pair',
            regex : /^;.*$/
        },
        "deref": {
            form  : 'key-value-pair',
            regex :  /^@/
        }
        // TODO: I don't really understand this one yet...
        // "with-meta"          : /^\^/
    };
    
    for (let type in types) {
        if (types.hasOwnProperty(type) && types[type].regex.test(token)) {
            types[type].value = token;
            delete types[type].regex;
            return types[type];
        }
    }

    return null;
    
    /**
     Type Classes:
        - Atom Type
        - Key/Value Type
        - List Type
        - W/meta???
     */
}

module.exports = Type;
