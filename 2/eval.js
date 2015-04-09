'use strict';
var Exception = require('./exception.js');
var util = require('util');

function Eval(env, ast) {
    this.env = env;
    this.ast = ast;
    return this;
}

Eval.prototype.eval_ast = function() {
    let type = this.astType();
};

module.exports = Eval;

