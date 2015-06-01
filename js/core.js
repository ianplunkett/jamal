'use strict';

let Exception = require('./exception.js');

function addition() {
    return {
        type: 'arithmetic',
        fn: (a,b) => a+b,
        string: '+'
    };
}

function subtraction() {
    return {
        type: 'arithmetic',
        fn: (a,b) => a-b,
        string: '-'
    };
}

function multiplication() {
    return {
        type: 'arithmetic',
        fn: (a,b) => a*b,
        string: '*'
    };
}

function division() {
    return {
        type: 'arithmetic',
        fn: (a,b) => parseInt(a/b),
        string: '/'
    };
}

function Core(env) {

    let ns = {
        '+' : addition,
        '-' : subtraction,
        '*' : multiplication,
        '/' : division,
        'def!' : {
            type: 'special',
            string: 'def!'
        },
        'let*' : {
            type: 'special',
            string: 'let*'
        },
        'do' : {
            type: 'special',
            string: 'do'
        },
        'if':  {
            type: 'special',
            string: 'if'
        },
        'fn*' : {
            type: 'special',
            string: 'fn*'
        }
    };

    for (let specialForm in ns) {
        if (ns.hasOwnProperty(specialForm)) {
            env.set(specialForm, ns[specialForm]);
        }
    }

    return env;
}

module.exports = Core;
