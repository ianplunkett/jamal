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
    console.log(ast);

    if(ast.length === 0){
        console.log('zero length');
        return false;
    }
    if(Array.isArray(ast)) {
        let newEvalList = this.eval_ast(ast);
        let operation = newEvalList.shift();
        let first = newEvalList.shift();
        let rest = newEvalList;
        return operation(first, this.run(rest));
    } else {
        return this.eval_ast(ast);
    }
};

Eval.prototype.eval_ast = function(ast) {
    let initialValue = '';
    let self = this;

    if (typeof typeof ast === 'number') {
        return ast;
    } else if (Array.isArray(ast)) {
        return ast.map( c => self.eval_ast(c) );
    } else if (typeof this.repl_env[ast] === 'undefined')  {
        console.log('Symbol not found in environment: '+ast);
        return false;
    } else {
        var operation = Object.keys(self.repl_env).reduce(
            function(previousValue, currentValue,index, array) {
                if(previousValue) {
                    currentValue = previousValue;
                    return currentValue;
                } else if(typeof self.repl_env[array[index]] !== 'undefined') {
                    currentValue = self.repl_env[array[index]];
                    return currentValue;
                } else {
                    currentValue = false;
                    return currentValue;
                }
            },
            initialValue
        );
        return operation;
    }
};


module.exports = Eval;
