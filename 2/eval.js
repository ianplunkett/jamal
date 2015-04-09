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
        return this.process_special();
    case 'arithmetic':
        return this.process_arithmetic();
    default:
        return this.process_symbol();
    }
};

Eval.prototype.process_list = function() {
    let first = this.ast.shift(),
        rest = this.ast,
        evaled_first = new Eval(this.env, first).eval_ast(),
        a,
        b;
    if(typeof evaled_first === 'object' && evaled_first.type === 'special'){
        console.log('processing a special list');
        a = this.ast.shift();
        b = this.ast.shift();
        if (this.ast.length > 0) {
            throw new Exception('improper special form invocation:' + evaled_first.value);
        }
        return evaled_first.value(a, new Eval(this.env, b).eval_ast());
//    case typeof first === 'object' && first.type === 'arithmetic':
    } else if(typeof evaled_first === 'object' && evaled_first.type === 'arithmetic') {
        a = new Eval(this.env, this.ast.shift());
        if (this.ast.length === 1) {
            return evaled_first.value(a.ast, new Eval(this.env, this.ast.shift()).eval_ast());
        } else {
            b = this.ast;
            b.unshift(first);
            let evaled_b = new Eval(this.env, b).eval_ast();
            return evaled_first.value(a.ast, evaled_b);
        }
        return "I don't know how to process this type of list";
    }
};

Eval.prototype.process_symbol = function() {
    return this.ast;
};

Eval.prototype.process_special = function() {
    return this.env[this.ast];
};

Eval.prototype.process_arithmetic = function() {
    return this.env[this.ast];
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

