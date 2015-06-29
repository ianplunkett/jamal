'use strict';

let Exception = require('./exception.js'),
    Env = require('./env.js');

function Eval(ast, env) {
    this.ast = ast;
    this.env = env;
    return this;
}

Eval.prototype.eval_ast = function() {
    switch (this.ast.type) {
        case 'list':
            return this.process_list();
        case 'vector':
            return this.process_vector();
        case 'hash-map':
            return this.process_hashmap();
        case 'symbol':
            return this.env.get(this.ast.value);
        default:
            return this.ast;
    }
};


Eval.prototype.process_special = function(symbol) {
    if (symbol === 'def!') {
        return this.process_def();
    } else if (symbol === 'let*') {
        return this.process_let();
    } else if (symbol === 'do') {
        return this.process_do();
    } else if (symbol === 'if') {
        return this.process_if();
    } else if (symbol === 'fn*') {
        return this.process_fn();
    } else {
        throw new Exception('unknown special symbol');
    }
};

Eval.prototype.process_fn = function() {
    let self = this;
    return function() {
        let binds = this.ast.shift();
        let exprs = this.ast.shift();
        this.env = new Env(self.env, binds, exprs);
        return new Eval(this.ast.shift(), this.env).eval_ast();
    };
};

Eval.prototype.process_do = function() {
    let length = this.ast.length,
        last;
    
    for(let i = 0; i < length; i++) {
        last = new Eval(this.env, this.ast.shift()).eval_ast();
    }
    return last;
};

Eval.prototype.process_if = function() {
    let length = this.ast.length;
    if (length < 2 || length > 3) {
        throw new Exception('improperly formatted if-then-else');
    }

    let test = new Eval(this.env, this.ast.shift()).eval_ast();
    if (test !== 'nil' && test !== 'false') {
        return new Eval(this.env, this.ast.shift()).eval_ast();
    } else if (length === 2) {
        return 'nil';
    } else {
        this.ast.shift();
        return new Eval(this.env, this.ast.shift()).eval_ast();
    }
    
};

Eval.prototype.process_let = function() {
    let env = new Env(this.env),
        bindings = this.ast.shift();
    
    if (!Array.isArray(bindings) || bindings.length % 2 === 1) {
        throw new Exception('poorly formatted binding list');
    } else {
        for (let i = 0; i < bindings.length; i += 2) {
            let data = {
                type: 'def!',
                value: new Eval(env, bindings[i+1]).eval_ast()
            };
            
            env.set(bindings[i], data);
        }
    }
    return new Eval(env, this.ast.shift()).eval_ast();
};

Eval.prototype.process_def = function() {

    let first = this.ast.shift(),
        rest = this.ast.shift();

    if (this.ast.length > 0) {
        throw new Exception('improper special form invocation:' + first);
    }

    let data = {
        type: 'def!',
        value: new Eval(this.env, rest).eval_ast()
    };
    this.env.set(first, data);
    return this.env.get(first).value;
};

Eval.prototype.process_list = function() {

    let list = this.ast.value,
        head = list.shift(),
        symbol_env = new Eval(head, this.env).eval_ast(),
        result = symbol_env.base_case;

    for (head of list) {
        let evaled_head = new Eval(head, this.env).eval_ast();
        result = symbol_env.fn(result.value, evaled_head.value);
    }
    
    return result;
};


Eval.prototype.process_vector = function() {
    let list = this.ast.value,
        processed_list = [];
    for (let item of list) {
        let evaled_item = new Eval(item, this.env).eval_ast();
        processed_list.push(evaled_item);
    }
    this.ast.value = processed_list;
    return this.ast;
};

Eval.prototype.process_hashmap = function() {
    let key = this.ast.value.shift(),
        value = this.ast.value.shift();
    if (this.ast.value.length > 0 || (key.type !== 'string' && key.type !== 'keyword')) {
        throw Exception("Invalid hash-map!");
    } 
    let evaled_value = new Eval(value, this.env).eval_ast();
    this.ast.value = [key, evaled_value];
    return this.ast;
};

module.exports = Eval;

