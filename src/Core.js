'use strict';

import Eval      from './Eval.js';
import Exception from './Exception.js';
import Printer   from './Printer.js';
import Reader    from './Reader.js';
import Tokenizer from './Tokenizer.js';
import Type      from './Type.js';

function arithmetic (ast, env, fn) {
    while(ast.next_sibling) {
        if (ast.next_sibling.data.form === 'list') {
            return [ast.next_sibling, env];
        } else if (ast.data.form === 'list') {
            return [ast, env];
        }
        ast.data.value = fn(ast.data.value, ast.next_sibling.data.value);
        ast.removeNextSibling();
    }
    ast.parent.data = ast.data;
    let parent = ast.parent;
    parent.removeLastChild();
    parent.removeLastChild();
    parent.removeFirstChild();
    if (parent.parent !== null) {
        return [parent.parent, env];
    } else {
        return [parent, env];
    }
}

function addition() {
    const operation = (a, b) => a + b;
    return {
        fn: (ast, env) => {
            return arithmetic(ast, env, operation);
        }
    };
}

function subtraction() {
    const operation = (a, b) => a - b;
    return {
        fn: (ast, env) => {
            return arithmetic(ast, env, operation);
        }
    };
}

function multiplication() {
    const operation = (a, b) => a * b;
    return {
        fn: (ast, env) => {
            return arithmetic(ast, env, operation);
        }
    };
}

function division() {
    const operation = (a, b) => a / b;
    return {
        fn: (ast, env) => {
            return arithmetic(ast, env, operation);
        }
    };
}


function list() {
    return {

        fn : (ast, env) => {
            while(ast.next_sibling) {
                if (ast.next_sibling.data.form === 'list') {
                    return [ast.next_sibling, env];
                } else if (ast.data.form === 'list') {
                    return [ast, env];
                }
                ast = ast.next_sibling;
            }
            let parent = ast.parent;
            parent.removeFirstChild();
            if (parent.parent !== null) {
                return [parent.parent, env];
            } else {
                return [parent, env];
            }
        }
        /*
        fn : (ast, env) => {
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

        }*/

    };
}

function is_list() {
    return {

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

        fn : (list, env) => {
            let head = list.shift();
            let evaled_head = new Eval(head, env).eval_ast();
            if (evaled_head.form === 'list' && evaled_head.value.length === 0) {
                return new Type('true');
            } else {
                return new Type('false');;
            }

        }
    };
}

function count() {
    return {

        fn : (list, env) => {
            let head = list.shift();
            let evaled_head = new Eval(head, env).eval_ast();
            if (evaled_head.form === 'list') {
                return new Type(evaled_head.value.length);
            } else {
                return new Type(0);
            }

        }
    };
}

function is_greater_than() {
    return {

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

        fn : (list, env) => {

            let left = list.shift();
            let right = list.shift();


            // TODO flatten out this logic.  This function is pretty convoluted.
            if (left.type === 'list' && left.value.length > 0 && env.data.hasOwnProperty(left.value[0].value)) {
                left = new Eval(left, env).eval_ast();
            } else if (left.type === 'vector') {
                left = new Eval(left, env).eval_ast();
            }

            if (right.type === 'list' && right.value.length > 0 && env.data.hasOwnProperty(right.value[0].value)) {
                right = new Eval(right, env).eval_ast();
            } else if (right.type === 'vector') {
                right = new Eval(right, env).eval_ast();
            }

            if (left.type === 'symbol') {
                left = env.get(left.value);
            }
            if (right.type === 'symbol') {
                right = env.get(right.value);
            }

            if (left.form === 'atom'
                && left.form === right.form
                && left.type === right.type
                && left.value === right.value) {
                return new Type('true');
            } else if (left.form === 'list'
                       && left.form === right.form
                       && left.value.length === right.value.length
                       && left.value.length === 0) {
                return new Type('true');
            } else if (left.form === 'list'
                       && left.form === right.form
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

        fn : (list, env) => {
            if (list.length === 0) {
                return new Type('""');
            } else {

                let out = '';
                for (let item of list) {
                    item = new Eval(item, env).eval_ast();
                    let string = new Printer(item, false).pr_str();
                    out = out + string;
                }
                let new_string = new Type('"'+out+'"');
                return new_string;
            }
        }
    };
}

function prn() {
    return {
        fn : (list, env) => {
            let out = '';
            for (let item of list) {
                item = new Eval(item, env).eval_ast();
                let string = new Printer(item).pr_str();
                if (out === '') {
                    out = string;
                } else {
                    out = out + ' ' +string;
                }
            }
            console.log(out);
            return new Type("nil");
        }
    };
}

function println() {
    return {
        fn : (list, env) => {
            let out = '';
            for (let item of list) {
                item = new Eval(item, env).eval_ast();
                let string = new Printer(item, false).pr_str();
                if (out === '') {
                    out = string;
                } else {
                    out = out + ' ' +string;
                }
            }
            out = out.toString().replace(/\\"/, '"');
            console.log(out);
            return new Type("nil");
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
            env.set(specialForm, ns[specialForm].fn);
        }
    }

    return env;
}

export default Core;
