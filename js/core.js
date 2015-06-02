'use strict';

let Exception = require('./exception.js');

function addition() {
    return {
        name : '+',
        type : 'arithmetic',
        fn : (a,b) => a+b
    };
}

function subtraction() {
    return {
        name : '-',
        type : 'arithmetic',
        fn : (a,b) => a-b
    };
}

function multiplication() {
    return {
        name : '*',
        type : 'arithmetic',
        fn : (a,b) => a*b
    };
}

function division() {
    return {
        name : '/',
        type : 'arithmetic',
        fn : (a,b) => parseInt(a/b)
    };
}

function def_() {
    return  {
        name : 'def!',
        type : 'special'
    };
}

function let_() {
    return {
        name : 'let*',
        type : 'special'
    };
}

function do_() {
    return {
        name : 'do',
        type : 'special'
    };
}

function if_() {
    return {
        name : 'if',
        type : 'special'
    };
}

function fn_() {
    return {
        name : 'fn*',
        type : 'special'
    };
}

function list() {
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

function Core(env) {

    let ns = {
        // Arithmetic
        '+' : addition(),
        '-' : subtraction(),
        '*' : multiplication(),
        '/' : division(),
        
        // Equality
        '='  : is_equal(),
        '>'  : is_greater_than(),
        '>=' : is_greater_than_or_equal(),
        '<'  : is_less_than(),
        '<=' : is_less_than_or_equal(),
        
        // Generic Special Forms
        'count'  : count(),
        'empty?' : is_empty(),
        'list'   : list(),
        'list?'  : is_list(),

        'def!'   : def_(),
        'do'     : do_(),
        'fn*'    : fn_(),
        'if'     : if_(),
        'let*'   : let_()

    };

    for (let specialForm in ns) {
        if (ns.hasOwnProperty(specialForm)) {
            env.set(specialForm, ns[specialForm]);
        }
    }

    return env;
}

module.exports = Core;
