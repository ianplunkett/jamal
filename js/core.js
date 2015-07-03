'use strict';

let Exception = require('./exception.js'),
    Reader    = require('./reader.js'),
    Tokenizer = require('./tokenizer.js'),
    Type      = require('./type.js');

function addition() {
    return {
        name : '+',
        type_signature : 'Integer...',
        return_type    : 'Integer',
        base_case      : () => new Type(0),
        fn : (a,b) => {
            let value = a.value+b.value,
                typed_value = new Type(value);
            return typed_value;
        }
    };
}

function subtraction() {
    return {
        name : '-',
        type_signature : 'Integer...',
        return_type    : 'Integer',
        base_case      : () => ({value: undefined}),
        fn : (a,b) => {
            if (typeof a.value === 'undefined') {
                return b;
            } else {
                let value = a.value-b.value,
                    typed_value = new Type(value);
                return typed_value;
            }
        }
    };
}

function multiplication() {
    return {
        name : '*',
        type_signature : 'Integer...',
        return_type    : 'Integer',
        base_case      : () => new Type(1),
        fn : (a,b) => {
            let value = a.value * b.value,
                typed_value = new Type(value);
            return typed_value;
        }
    };
}

function division() {
    return {
        name : '/',
        type_signature : 'Integer...',
        return_type    : 'Integer',
        base_case      : () => ({value: undefined}),
        fn : (a,b) => {
            if (typeof a.value === 'undefined') {
                return b;
            } else {
                let value = parseInt(a.value/b.value),
                    typed_value = new Type(value);
                return typed_value;
            }
        }
    };
}


function list() {
    return {
        name : 'list',
        type_signature : 'List',
        return_type    : 'List',
        base_case      : () =>  new Reader(new Tokenizer('()')).read_str(),
        fn : (a,b) => {
            a.value.push(b);
            return a;
        }
        
    };
}

/*

function fn_() {
    return {
        name : 'fn*',
        type : 'special'
    };
}


function is_list() {
    return {
        name : 'list',
        type : 'special'
    };
}

function count() {
    return {
        name : 'count',
        type: 'special'
    };
}

function is_empty() {
    return {
        name : 'empty?',
        type : 'special'
    };
}

function is_equal() {
    return {
        name : '=',
        type : 'equality'
    };
}

function is_greater_than() {
    return {
        name : '>',
        type : 'equality'
    };
}

function is_greater_than_or_equal() {
    return {
        name : '>=',
        type : 'equality'
    };
}

function is_less_than() {
    return {
        name : '<',
        type : 'equality'
    };
}

function is_less_than_or_equal() {
    return {
        name : '<=',
        type : 'equality'
    };
}
*/

function Core(env) {

    let ns = {
        // Arithmetic
        '+' : addition(),
        '-' : subtraction(),
        '*' : multiplication(),
        '/' : division(),

        // List operations
        'list'   : list()

/*        
        // Equality
        '='  : is_equal(),
        '>'  : is_greater_than(),
        '>=' : is_greater_than_or_equal(),
        '<'  : is_less_than(),
        '<=' : is_less_than_or_equal(),
        
        // Generic Special Forms
        'count'  : count(),
        'empty?' : is_empty(),
        'list?'  : is_list()
*/
    };

    for (let specialForm in ns) {
        if (ns.hasOwnProperty(specialForm)) {
            env.set(specialForm, ns[specialForm]);
        }
    }

    return env;
}

module.exports = Core;
