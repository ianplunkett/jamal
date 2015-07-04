'use strict';

let Eval      = require('./eval.js'),
    Exception = require('./exception.js'),
    Reader    = require('./reader.js'),
    Tokenizer = require('./tokenizer.js'),
    Type      = require('./type.js');

function addition() {
    return {
        name : '+',
        fn : (list, env) => {
            let product = 0;
            if (list.length < 2) {
                throw Exception('Two or more elements required for addition');
            }
            for (let head of list) {
                let evaled_head = new Eval(head, env).eval_ast();
                if (evaled_head.type !== 'integer') {
                    throw Exception('Integer values required for addition');
                }
                product += evaled_head.value;
            }
            return new Type(product);
        }
    };
}

function subtraction() {
    return {
        name : '-',
        fn : (list, env) => {
            if (list.length < 2) {
                throw Exception('Two or more elements required for addition');
            }
            let product = undefined;
            for (let head of list) {
                let evaled_head = new Eval(head, env).eval_ast();
                if (evaled_head.type !== 'integer') {
                    throw Exception('Integer values required for addition');
                }
                if (product === undefined) {
                    product = evaled_head.value;
                } else {
                    product -= evaled_head.value;
                }
            }
            return new Type(product);
        }
    };
}

function multiplication() {
    return {
        name : '*',
        fn : (list, env) => {
            if (list.length < 2) {
                throw Exception('Two or more elements required for addition');
            }
            let product = undefined;
            for (let head of list) {
                let evaled_head = new Eval(head, env).eval_ast();
                if (evaled_head.type !== 'integer') {
                    throw Exception('Integer values required for addition');
                }
                if (product === undefined) {
                    product = evaled_head.value;
                } else {
                    product *= evaled_head.value;
                }
            }
            return new Type(product);
        }
    };
}

function division() {
    return {
        name : '/',
        type_signature : 'Integer...',
        return_type    : 'Integer',
        base_case      : () => ({value: undefined}),
        fn : (list, env) => {
            if (list.length < 2) {
                throw Exception('Two or more elements required for addition');
            }
            let product = undefined;
            for (let head of list) {
                let evaled_head = new Eval(head, env).eval_ast();
                if (evaled_head.type !== 'integer') {
                    throw Exception('Integer values required for addition');
                }
                if (product === undefined) {
                    product = evaled_head.value;
                } else {
                    product /= evaled_head.value;
                }
            }
            return new Type(product);
        }
    };
}


function list() {
    return {
        name : 'list',
        fn : (list, env) => {
            let out_list = new Reader(new Tokenizer('()')).read_str();
            if (list.count === 0) {
                return out_list;
            } else {
                for (let head of list) {
                    let evaled_head = new Eval(head, env).eval_ast();
                    out_list.value.push(evaled_head);
                }
                return out_list;
            }

        }
        
    };
}

function is_list() {
    return {
        name : 'list',
        fn : (list, env) => {
            let head = list.shift();
            let evaled_head = new Eval(head, env).eval_ast();
            if (evaled_head.type === 'list') {
                return new Type('true');
            } else {
                return new Type('false');;
            }
        }
    };
}

function is_empty() {
    return {
        name : 'empty?',
        fn : (list, env) => {
            let head = list.shift();
            let evaled_head = new Eval(head, env).eval_ast();
            if (evaled_head.type === 'list' && evaled_head.value.length === 0) {
                return new Type('true');
            } else {
                return new Type('false');;
            }
            
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



function count() {
    return {
        name : 'count',
        type: 'special'
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
        'list'   : list(),
        'list?'  : is_list(),
        'empty?' : is_empty()

/*        
        // Equality
        '='  : is_equal(),
        '>'  : is_greater_than(),
        '>=' : is_greater_than_or_equal(),
        '<'  : is_less_than(),
        '<=' : is_less_than_or_equal(),
        
        // Generic Special Forms
        'count'  : count(),


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
