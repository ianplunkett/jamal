'use strict';
var Exception = require('./exception.js');
var util = require('util');
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
function Eval(env) {
    this.env = env;
    return this;
}

Eval.prototype.load_env = function() {
    var self = this;
    this.env.set('+', (a,b) => a+b);
    this.env.set('-', (a,b) => a-b);
    this.env.set('*', (a,b) => a*b);
    this.env.set('/', (a,b) => parseInt(a/b));
    this.env.set('def!', (a,b) => self.env.set(a, b));
    return this;
};

Eval.prototype.ast_type = function(ast) {
    let special = {
        'def!': true,
        'let*': true
    };
    if (Array.isArray(ast)) {
        return 'list';
    } else if (typeof ast === 'number') {
        return 'number';
    } else if (special[ast] === true) {
        return 'special';
    } else {
        return 'symbol';
    }
};

Eval.prototype.run = function(ast) {
    this.load_env();
    let op_code,
        op_code_symbol ='',
        head,
        next,
        rest,
        list;
    
    switch (this.ast_type(ast)) {
    case 'list':
        op_code_symbol = ast[0];
        if (this.ast_type(op_code_symbol) !== 'special' ) {
            list = this.eval_ast(ast);
            op_code_symbol = ast.shift();
            op_code = list.shift();

            head = this.eval_ast(list.shift());
            if(list.length === 0) {
                return head;
            }
            list.unshift(op_code_symbol);
            // Recursively apply symbol function to the rest of the list
            rest = this.run(list);
            return op_code(head, rest);
        } else {
            op_code_symbol = ast.shift();
            op_code = this.eval_ast(op_code_symbol);
            head = ast.shift();
            next = ast.shift();
            this.env = op_code(head, next);
            console.log(this.env);
            return this.env[head];
        }
    default:
        return this.eval_ast(ast);        
    }
};

Eval.prototype.eval_ast = function(ast) {
    let astType = this.ast_type(ast);
    let self = this,
        operation;
    switch (astType) {
    case 'special':
        operation = self.env.get(ast);
        return operation;
    case 'symbol':
        operation = self.env.get(ast);
        if (operation === false) {
            throw new Exception('Symbol not found in environment: '+ast);
        } else {
            return operation;
        }
    case 'list':
        return ast.map( c => self.run(c) );
    default:
        return ast;
    }
};

module.exports = Eval;
