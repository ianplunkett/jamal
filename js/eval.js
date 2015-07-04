'use strict';

let Exception = require('./exception.js'),
    Env = require('./env.js');

function Eval(ast, env) {
    this.ast = ast;
    this.env = env;
    
    this.special = {
        'def!' : true,
        'let*' : true
    };
    
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
            return this.process_symbol();
        default:
            return this.ast;
    }
};

Eval.prototype.process_symbol = function() {
    return this.env.get(this.ast.value);
};

Eval.prototype.process_special = function(type) {
    switch(type)  {
        case 'def!':
            return this.process_def();
        case 'let*':
            return this.process_let();
        default:
            return this.ast;
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
        bindings = this.ast.value.shift();
    
    if (bindings.value.length % 2 === 1) {
        throw new Exception('poorly formatted binding list');
    }

    for (let i = 0; i < bindings.value.length; i += 2) {
        env.set(bindings.value[i].value, new Eval(bindings.value[i+1], env).eval_ast());
    }

    let ret = new Eval(this.ast.value.shift(), env).eval_ast();
    return ret;
};

Eval.prototype.process_def = function() {

    let first = this.ast.value.shift(),
        rest = this.ast.value.shift();

    if (this.ast.value.length > 0) {
        throw new Exception('improper special form invocation:' + first);
    }

    this.env.set(first.value, new Eval(rest, this.env).eval_ast());
    return this.env.get(first.value);
};

Eval.prototype.process_list = function() {

    let list = this.ast.value,
        head = list.shift();

    if (this.special[head.value] === true) {
        return this.process_special(head.value);
    }
    
    let symbol_env = new Eval(head, this.env).eval_ast();
    return symbol_env.fn(list, this.env);

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

