'use strict';
var Exception = require('./exception.js');

function Eval(env, ast) {
    this.env = env;
    this.ast = ast;
    return this;
}

Eval.prototype.eval_ast = function() {
    switch (this.ast_type()) {
    case 'list':
        return this.process_list();
    case 'special':
        return this.env.get(this.ast);
    case 'arithmetic':
        return this.env.get(this.ast);
    case 'user_defined':
        return this.env.get(this.ast).value;
    default:
        return this.ast;
    }
};

Eval.prototype.process_special = function(symbol) {
    if (symbol === 'def!') {
        return this.process_def();
    } else {
        return 'error!';
    }
//    return evaled_first.value(first, new Eval(this.env, rest).eval_ast());
};

Eval.prototype.process_def = function() {

    let first = this.ast.shift(),
        rest = this.ast.shift();

    if (this.ast.length > 0) {
        throw new Exception('improper special form invocation:' + evaled_first.value);
    }

    let data = {
        type: 'user_defined',
        value: new Eval(this.env, rest).eval_ast()
    };
    this.env.set(first, data);
    return this.env.get(first).value;
};

Eval.prototype.process_arithmetic = function(symbol, symbol_value) {
    
    let first = new Eval(this.env, this.ast.shift()).eval_ast();
    let next =  new Eval(this.env, this.ast.shift()).eval_ast();
    let result = symbol_value.value(first, next);
    
    if (this.ast.length === 0) {
        return result;
    } else {
        let new_list = [symbol,result].concat(this.ast);
        return new Eval(this.env, new_list).eval_ast();
    }

};

Eval.prototype.process_list = function() {

    let symbol = this.ast.shift(),
        symbol_value = new Eval(this.env, symbol).eval_ast();

    if(typeof symbol_value === 'object' && symbol_value.type === 'special'){
        return this.process_special(symbol);
    } else if(typeof symbol_value === 'object' && symbol_value.type === 'arithmetic') {
        return this.process_arithmetic(symbol, symbol_value);
    } else {
        throw new Exception("I don't know how to process this type of list");
    }
};

Eval.prototype.ast_type = function() {

    if (typeof this.env.get(this.ast) === 'object' && this.env.get(this.ast).type === 'user_defined') {
        return 'user_defined';
    }
    else if (Array.isArray(this.ast)) {
        return 'list';
    } else if (typeof this.ast === 'number') {
        return 'number';
    } else if (typeof this.env.get(this.ast) === 'object') {
        return this.env.get(this.ast).type;
    } else {
        return 'symbol';
    }
};

module.exports = Eval;

