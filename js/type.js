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
            regex : /^".*"$/
	}, {
	    type  : 'integer',
            regex : /^\d+$/,
	    transform :integer => parseInt(integer)
	}, {
	    type  : 'keyword',
            regex : /^:/,
	    transform : string => string.replace(/:/,'\u029E')
	}, {
	    type  : 'whole-line-comment',
	    regex :/^;;/ 
        }
    ];

    let typed_token = {form : 'atom'};
    // Default type is 'symbol'
    typed_token.value = { symbol : token };

    let value = {};
    for (let form of forms) {
	if (form.regex.test(token) && form.hasOwnProperty('transform')) {
	    value[form.type] = form.transform(token);
	    typed_token.value = value;
	    break;
	} else if (form.regex.test(token)) {
	    value[form.type] = token;
	    typed_token.value = value;
	    break;
	}
    }


    return typed_token;
}

function pair(token) {

    let typed_token = {form : 'pair'};
    let forms = [
	{
	    type      : 'quote',  
	    character : "'" 
	}, {
	    type      : 'quasiquote',
	    character : "`"
	}, {
	    type      : 'unquote',
	    character : "~"
	}, {
	    type      : 'splice-unquote',
	    character : "~@"
	}, {
	    type      : 'comment-after-exp',
	    character : ";"
	}, {
	    type      : 'deref',
	    character : "@"
	}
    ];

    let value = {};
    for (let form of forms) {
	if (form.character === token) {
	    value[form.type] = token;
	    typed_token.value = value;
	    break;
	}
    }

    return typed_token;
}

function list() {

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

    console.log(typed_token);
    return typed_token;

    /** two item list
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
