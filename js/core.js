'use strict';

let Eval      = require('./eval.js'),
    Exception = require('./exception.js'),
    Printer   = require('./printer.js'),
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

function count() {
    return {
        name : 'count',
        fn : (list, env) => {
            let head = list.shift();
            let evaled_head = new Eval(head, env).eval_ast();
            if (evaled_head.type === 'list') {
                return new Type(evaled_head.value.length);
            } else {
                return new Type(0);
            }
            
        }
    };
}

function is_greater_than() {
    return {
        name : '>',
        fn : (list, env) => {
            let left = new Eval(list.shift(), env).eval_ast();
            let right = new Eval(list.shift(), env).eval_ast();
            if (left.type !== 'integer' && right.type !== 'integer') {
                throw Exception('Incorrect types for equality check');
            } else if (left.value > right.value) {
                return new Type('true');
            } else {
                return new Type('false');
            }
        }
    };
}

function is_less_than() {
    return {
        name : '<',
        fn : (list, env) => {
            let left = new Eval(list.shift(), env).eval_ast();
            let right = new Eval(list.shift(), env).eval_ast();
            if (left.type !== 'integer' && right.type !== 'integer') {
                throw Exception('Incorrect types for equality check');
            } else if (left.value < right.value) {
                return new Type('true');
            } else {
                return new Type('false');
            }
        }
    };
}

function is_greater_than_or_equal() {
    return {
        name : '>=',
        fn : (list, env) => {
            let left = new Eval(list.shift(), env).eval_ast();
            let right = new Eval(list.shift(), env).eval_ast();
            if (left.type !== 'integer' && right.type !== 'integer') {
                throw Exception('Incorrect types for equality check');
            } else if (left.value >= right.value) {
                return new Type('true');
            } else {
                return new Type('false');
            }
        }
    };
}


function is_less_than_or_equal() {
    return {
        name : '<=',
        fn : (list, env) => {
            let left = new Eval(list.shift(), env).eval_ast();
            let right = new Eval(list.shift(), env).eval_ast();
            if (left.type !== 'integer' && right.type !== 'integer') {
                throw Exception('Incorrect types for equality check');
            } else if (left.value <= right.value) {
                return new Type('true');
            } else {
                return new Type('false');
            }
        }
    };
}

function is_equal() {
    return {
        name : '=',
        fn : (list, env) => {

            let left = list.shift();
            let right = list.shift();


            // TODO flatten out this logic.  This function is pretty convoluted.
            if (left.type === 'list' && left.value.length > 0 && env.data.hasOwnProperty(left.value[0].value)) {
                left = new Eval(left, env).eval_ast();
            } 
            if (right.type === 'list' && right.value.length > 0 && env.data.hasOwnProperty(right.value[0].value)) {
                right = new Eval(right, env).eval_ast();
            } 

            if (left.form === 'atom'
                && left.form === right.form
                && left.type === right.type
                && left.value === right.value) {
                return new Type('true');
            } else if (left.form === 'list'
                       && left.form === right.form
                       && left.type === right.type
                       && left.value.length === right.value.length
                       && left.value.length === 0) {
                return new Type('true');
            } else if (left.form === 'list'
                       && left.form === right.form
                       && left.type === right.type
                       && left.value.length === right.value.length) {
                
                let head_equality = is_equal().fn([left.value.shift(), right.value.shift()], env);
                if (head_equality.value === 'false') {
                    return head_equality;
                } else {
                    return is_equal().fn([left, right], env);
                }
            } else {
                return new Type('false');
            }
        }
    };
}

function pr_str() {
    return {
        name : 'pr-str',
        fn : (list, env) => {
            let out = '';
            for (let item of list) {
                item = new Eval(item, env).eval_ast();
                let string = new Printer(item, true).pr_str();
                if (out === '') {
                    out = string;
                } else {
                    out = out + ' ' +string;
                }
            }
            let new_string = new Type('"'+out+'"');
            new_string.formatted = true;
            return new_string;
        }
    };
}

function str() {
    return {
        name : 'str',
        fn : (list, env) => {
        }
    };
}

function prn() {
    return {
        name : 'prn',
        fn : (list, env) => {
            let out = '';
            for (let item of list) {
                let string = new Printer(item).pr_str(true);
                out += string;
            }
            console.log(out);
            return new Type("nil");
        }
    };
}

function println() {
    return {
        name : 'println',
        fn : (list, env) => {
        }
    };
}


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
        'empty?' : is_empty(),
        'count'  : count(),

        // Equality
        '>'  : is_greater_than(),
        '>=' : is_greater_than_or_equal(),
        '<'  : is_less_than(),
        '<=' : is_less_than_or_equal(),
        '='  : is_equal(),

        // Strings
        'pr-str'  : pr_str(),
        'str'     : str(),
        'prn'     : prn(),
        'println' : println()
    };

    for (let specialForm in ns) {
        if (ns.hasOwnProperty(specialForm)) {
            env.set(specialForm, ns[specialForm]);
        }
    }

    return env;
}

module.exports = Core;
