/**
* Generated On: 2015-7-29
* Class: EVAL
*/

const apply    = require('apply'),
      eval_ast = require('eval_ast');

function EVAL(ast, env){

    do {
        [ast, env] = eval_ast(ast, env);
        [ast, env] = apply(ast, env);
    } while (ast.hasChildren())

    return [ast, env];
}



module.exports = {EVAL:EVAL};
