'use strict';
var ReplException = require('./repl_exception.js');
/**
Create a new function eval_ast which takes ast (mal data type) and an
associative structure (the environment from above). eval_ast switches
on the type of ast as follows:

 symbol: lookup the symbol in the environment structure and return the
    value or raise an error no value is found 
 list: return a new list
    that is the result of calling EVAL on each of the members of the list 
 otherwise just return the original ast value
*/
function Eval(ast) {
    this.repl_env = {
        '+': (a,b) => a+b,
        '-': (a,b) => a-b,
        '*': (a,b) => a*b,
        '/': (a,b) => parseInt(a/b)
    };
    return this;
}

Eval.prototype.run = function(ast) {

    if(Array.isArray(ast)) {
        let eval_list = this.eval_ast(ast);
        let op_code = eval_list.shift();
        let first = eval_list.shift();
        let left = this.eval_ast(first);
        let right = this.eval_ast(eval_list);
        return op_code(left, right[0]);
    } else {
        return this.eval_ast(ast);
    }
};

Eval.prototype.eval_ast = function(ast) {

    let self = this;
    if (
        typeof ast !== 'number'
            && typeof self.repl_env[ast] !== 'undefined'
            && !Array.isArray(ast))
    {
        return self.repl_env[ast];
    } else if (
        typeof ast !== 'number'
            && typeof self.repl_env[ast] === 'undefined'
            && !Array.isArray(ast))
    {
        throw new ReplException('Symbol not found in environment: '+ast);
    } else if (Array.isArray(ast)) {
        return ast.map( c => self.run(c) );
    } else {
        return ast;
    }
};

module.exports = Eval;
