/**
* Generated On: 2015-7-29
* Class: eval_ast
*/

var Env = require('Env');

/**
* @return eval_ast 
*/
function eval_ast(ast, env){
    //Constructor
    this.AST = ast;
    this.ENV = env;
    return this;
}


/**
* @return AST {[object Object]} 
*/
eval_ast.prototype.list = function(){
    return this.AST.firstChild();
};


/**
* @return AST {[object Object]} 
*/
eval_ast.prototype.symbol = function(){
    return this.ENV.get(this.AST);
};


/**
* @return AST {[object Object]} 
*/
eval_ast.prototype.vector = function(){
    //TODO: Implement Me 
    return this.AST;
};


/**
* @return AST {[object Object]} 
*/
eval_ast.prototype.hash_map = function(){
    //TODO: Implement Me 
    return this.AST;
};



module.exports = {eval_ast:eval_ast};
