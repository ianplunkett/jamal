'use strict';

function atom(token) {

    const forms = [
        /**  atoms */
        {
            type  : 'nil',
            regex :  /^nil$/
        }, {
            type : 'boolean',
            regex:  /^true|false$/
        }, {
            type  : 'string',
            regex : /^".*"$/,
            transform : string => {
                return string;
            }
        }, {
            type  : 'integer',
            regex : /^-?\d+$/,
            transform : integer => parseInt(integer)
        }, {
            type  : 'keyword',
            regex : /^:/
        }, {
            type  : 'whole-line-comment',
            regex : /^;;/
        }, {
            type      : 'comment-after-exp',
            regex : /^;/
        }
    ];

    // Defaults for typed_token
    let typed_token = {
        form : 'atom',
        type : 'symbol',
        value : token
    };

    let value = {};
    for (let form of forms) {
        if (form.regex.test(token) && form.hasOwnProperty('transform')) {
            typed_token.type = form.type;
            typed_token.value = form.transform(token);
            break;
        } else if (form.regex.test(token)) {
            typed_token.type = form.type;
            typed_token.value = token;
            break;
        }
    }

    return typed_token;
}

function pair(token) {

    let forms = [
        {
            type      : 'quote',
            character : "'",
            begin     : '(quote',
            end       : ')'
        }, {
            type      : 'quasiquote',
            character : "`",
            begin     : '(quasiquote',
            end       : ')'
        }, {
            type      : 'unquote',
            character : "~",
            begin     : '(unquote',
            end       : ')'
        }, {
            type      : 'splice-unquote',
            character : "~@",
            begin     : '(splice-unquote',
            end       : ')'
        }, {
            type      : 'deref',
            character : "@",
            begin     : '(deref',
            end       : ')'
        }
    ];


    let typed_token = {
        form : 'pair'
    };

    for (let form of forms) {
        if (form.character === token) {
            typed_token.type = form.type;
            typed_token.begin = form.begin;
            typed_token.end = form.end;
            typed_token.value = token;
            break;
        }
    }

    return typed_token;
}

function list(token) {
    let typed_token = {form : 'list'};
    let forms = [
        {
            type  : 'list',
            begin : "(",
            end   : ")"

        }, {
            type  : 'vector',
            begin : "[",
            end   : "]"
        }, {
            type  : 'hash-map',
            begin : "{",
            end   : "}"
        }
    ];

    let value = {};
    for (let form of forms) {
        if (form.begin === token) {
            typed_token.value  = form.type;
            typed_token.begin = form.begin;
            typed_token.end = form.end;
            break;
        }
    }

    return typed_token;
}

function Type(token) {

    let typed_token = {};

    if (token.length <= 2) {
        typed_token = pair(token);
    }

    if (token.length <= 2 && !typed_token.hasOwnProperty('value')) {
        typed_token = list(token);
    }

    if (!typed_token.hasOwnProperty('value')) {
        typed_token = atom(token);
    }

    return typed_token;
    
    /**
     TODO: I don't really understand this one yet...
     ['with-meta',/^\^/ ]
     */

}

module.exports = Type;
