'use strict';

function atom(token) {

    const forms = [
        /**  atoms */
        [ 'nil', /^nil$/ ],
        [ 'boolean', /^true|false$/ ],
        [ 'integer', /^\d+$/, string => parseInt(string) ]
        [ 'string',  /^".*"$/ ],
        [ 'keyword', /^:/, string => string.replace(/:/,'\u029E') ],
        [ 'whole-line-comment',  /^;;/ ]
    ];

    let typed_token = {};

    for (let form of forms) {
        if (form[1].test(token) && form.length > 2) {
            typed_token.form[0] = form[2](token);
            return typed_token;
        } else if (form[1].test(token)) {
            typed_token.form[0] = token;
            return typed_token;
        }
        
    }

    return { symbol : token };
}

function Type(token) {

    return atom(token);

        /** two item list 
        [ 'pair', 'quote',  "'" ],
        [ 'pair', 'quasiquote', "`" ],
        [ 'pair', 'unquote', "~" ],
        [ 'pair', 'splice-unquote', "~@" ],
        [ 'pair', 'comment-after-exp', /^;.*$/]
        [ 'pair', 'deref', /^@/ ]
        /** lists of undetermined length 
        [ 'list', 'list', '(' ],
        [ 'list', 'vector', '[' ],
        [ 'list', 'hash-map', '{' ]
        /** 
         TODO: I don't really understand this one yet...
         ['with-meta',/^\^/ ]
         */
    
    /**
     Type Classes:
        - Atom Type
        - Key/Value Type
        - List Type
        - W/meta???
     */
}

module.exports = Type;
