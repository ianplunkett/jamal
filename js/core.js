'use strict';

let Exception = require('./exception.js');

function addition() {
    return {
        type : 'arithmetic',
        string : '+',
        fn : (a,b) => a+b
    };
}

function subtraction() {
    return {
        type : 'arithmetic',
        string : '-',
        fn : (a,b) => a-b
    };
}

function multiplication() {
    return {
        type : 'arithmetic',
        string : '*',
        fn : (a,b) => a*b
    };
}

function division() {
    return {
        type : 'arithmetic',
        string : '/',
        fn : (a,b) => parseInt(a/b)
    };
}

function def_() {
    return  {
        type : 'special',
        string : 'def!'
    };
}

function let_() {
    return {
        type : 'special',
        string : 'let*'
    };
}

function do_() {
    return {
        type : 'special',
        string : 'do'
    };
}

function if_() {
    return {
        type : 'special',
        string : 'if'
    };
}

function fn_() {
    return {
        type : 'special',
        string : 'fn*'
    };
}

function list() {
    return {
        type : 'special',
        string : 'fn*'
    };
}

function is_list() {
    return {
        type : 'special',
        string : 'list'
    };
}

function count() {
    return {
        type: 'special',
        string : 'count'
    };
}

function is_empty() {
    return {
        type : 'special',
        string : 'empty?'
    };
}

function is_equal() {
    return {
        type : 'equality',
        string : '='
    };
}

function is_greater_than() {
    return {
        type : 'equality',
        string : '>'
    };
}

function is_greater_than_or_equal() {
    return {
        type : 'equality',
        string : '>='
    };
}

function is_less_than() {
    return {
        type : 'equality',
        string : '<'
    };
}

function is_less_than_or_equal() {
    return {
        type : 'equality',
        string : '<='
    };
}

function Core(env) {

    let ns = {
        '+' : addition(),
        '-' : subtraction(),
        '*' : multiplication(),
        '/' : division(),
        'def!' : def_(),
        'let*' : let_(),
        'do' : do_(),
        'if' :  if_(),
        'fn*' : fn_(),
        'list': list(),
        'list?': is_list(),
        'count' : count(),
        'empty?' : is_empty(),
        '=' : is_equal(),
        '>' : is_greater_than(),
        '>=' : is_greater_than_or_equal(),
        '<' : is_less_than(),
        '<=' : is_less_than_or_equal()
    };

    for (let specialForm in ns) {
        if (ns.hasOwnProperty(specialForm)) {
            env.set(specialForm, ns[specialForm]);
        }
    }

    return env;
}

module.exports = Core;
