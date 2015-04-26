'use strict';
var Exception = require('./exception.js');
var util = require('util');

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
        return this.env[this.ast];
    case 'arithmetic':
        return this.env[this.ast];
    default:
        return this.ast;
    }
};

Eval.prototype.process_special = function(evaled_first) {
    let first = this.ast.shift(),
        rest = this.ast.shift();
    if (this.ast.length > 0) {
        throw new Exception('improper special form invocation:' + evaled_first.value);
    }
    return evaled_first.value(first, new Eval(this.env, rest).eval_ast());
};

Eval.prototype.process_arithmetic = function(symbol, symbol_value) {
    
    let first = new Eval(this.env, this.ast.shift()).eval_ast();
    let next =  new Eval(this.env, this.ast.shift()).eval_ast();
    let result = symbol_value.value(first, next);
    
    if (this.ast.length === 0) {
        return result;
    } else {
        let new_list = [symbol,result].concat(this.ast);
        let rest_value = new Eval(this.env, new_list).eval_ast();
        return rest_value;
    }

};

Eval.prototype.process_list = function() {

    let symbol = this.ast.shift(),
        symbol_value = new Eval(this.env, symbol).eval_ast();

    if(typeof symbol_value === 'object' && symbol_value.type === 'special'){
        return this.process_special(symbol_value);
    } else if(typeof symbol_value === 'object' && symbol_value.type === 'arithmetic') {
        return this.process_arithmetic(symbol, symbol_value);
    } else {
        throw new Exception("I don't know how to process this type of list");
    }
};

Eval.prototype.ast_type = function() {

    if (Array.isArray(this.ast)) {
        return 'list';
    } else if (typeof this.ast === 'number') {
        return 'number';
    } else if (typeof this.env[this.ast] === 'object') {
        return this.env[this.ast].type;
    } else {
        return 'symbol';
    }
};

module.exports = Eval;

