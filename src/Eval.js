'use strict';

import Env       from './Env.js';
import Exception from './Exception.js';
import Type      from './Type.js';

function Eval(ast, env){

    do {
        [ast, env] = eval_ast(ast, env);
        [ast, env] = apply(ast, env);
    } while (ast)

    return [ast, env];
}

function eval_ast(ast, env) {

    const type = ast.data.type;

    switch(type) {
        case "symbol":
            ast.data.value = env.get(ast.data.value);
            return [ast, env];
        case "list":
            return [ast.first_child, env];
        case "vector":
            return [ast.first_child, env];
        case "hash-map":
            return [ast.first_child, env];
        default:
            return [ast, env];
    }
}

function apply(ast, env) {
    
    const value = ast.data.value;

    switch(value) {
        case "let*":
            return apply_let(ast, env);
        case "do":
            return apply_do(ast, env);
        case "if":
            return apply_if(ast, env);
        case "fn*":
            return apply_fn(ast, env);
        case "def!":
            return apply_def(ast, env);
        default:
            return apply_env(ast, env);
    }

    ast = null;
    return [ast, env];
}

function apply_let(ast,env) {
    ast = null;
    return [ast, env];
}

function apply_do(ast,env) {
    ast = null;
    return [ast, env];
}

function apply_if(ast,env) {
    ast = null;
    return [ast, env];
}

function apply_def(ast,env) {
    ast = null;
    return [ast, env];
}

function apply_fn(ast,env) {
    ast = null;
    return [ast, env];
}

function apply_env(ast, env) {
    const symbol = ast.data.value,
          apply  = env.get(symbol);
    [ast, env] = apply(ast.next_sibling, env);
    return [ast, env];
}

/*
const build_ast = (ast, call_stack) => {

    if (call_stack.length === 0) {
        return {
            ast : ast,
            call_stack : []
        };
    } else if (ast.form === 'atom') {
        let current_call = call_stack.pop();
        current_call.push(ast);
        return {
            ast: {
                form : 'list',
                type : 'list',
                value : current_call
            },
            call_stack: call_stack
        };
    } else {
        // TODO - this is not complete
        return ast;
    }
};

const apply = (evaled_ast) => {

    const operation = evaled_ast.ast.shift(),
          list = evaled_ast.shift();

    let env = evaled_ast.env,
        call_stack = evaled_ast.call_stack;

    const special =  {

        'def!' : (rest) => {
            
            if (rest.type !== 'list') {
                throw new Exception('def! must be applied to a list');
            }

            const symbol = rest.value.shift();
            if (symbol.type !== 'symbol' && symbol.type !== 'keyword') {
                throw new Exception('def! must be applied to symbol or keyword');
            }

            const body = rest.value.shift();
            if (body.form !== 'atom') {
                call_stack.push([head, symbol]);
            } else if (body.type === 'symbol') {
                env.set(symbol.value,env.get(body.value));
            } else {
                env.set(symbol.value, body);
            }
            return body;
        }
    };

    if (special.hasOwnProperty(operation.value)) {
        return special[operation.value](list);
    } else {
        return operation(list.value, env, call_stack);
    }

};

function Eval(ast, env) {

    let call_stack = [];
    
    while(true) {

        const ast_call_stack = build_ast(ast, call_stack);
        ast = ast_call_stack.ast;
        call_stack = ast_call_stack.call_stack;
        
        if (ast.type !== 'list') {
            let evaled_ast = eval_ast(ast, env, call_stack);
            if (evaled_ast.call_stack.length === 0) {
                ast = evaled_ast.ast;
                break;
            }
            
        } else if (ast.type === 'list') {
            let evaled_ast = eval_ast(ast, env, call_stack);
            if (evaled_ast.call_stack.length === 0) {
                ast = apply(evaled_ast);
                ast = evaled_ast.ast;
                break;
            } else {
                call_stack = evaled_ast.call_stack;
                env = evaled_ast.env;
                ast = evaled_ast.ast;
            }
        } else if (ast.type === 'list_elements') {
            let evaled_ast = eval_ast(ast.value.shift(), env, call_stack);
            call_stack = evaled_ast.call_stack;
            env = eval_ast.env;
        }
    }
    
    return ast;
}

/**
*/
/**
            'do'   : () => {/**
                             let length = ast.value.length,
                             last;
                             
                             for(let i = 0; i < length; i++) {
                             last = new Eval(ast.value.shift(), env).eval_ast();
                             }
                             return last;
            },
            'fn*'  : () => { /**
                              let self           = this,
                              binds          = self.ast.value.shift(),
                              ast            = self.ast.value.shift(),
                              serialized_ast = JSON.stringify(ast);
                              
                              return {
                              form : 'closure',
                              fn   : (exprs, env) => {
                              let evaled_exprs = [];
                              for (let expr of exprs) {
                              let evaled_expr = new Eval(expr, env).eval_ast();
                              evaled_exprs.push(evaled_expr);
                              }
                              this.env = new Env(self.env, binds.value, evaled_exprs);
                              let inner_ast = JSON.parse(serialized_ast);
                              return new Eval(inner_ast, this.env).eval_ast();
                              }};
                              },
            'if'   : () => {
                let length = this.ast.value.length;
                if (length < 2 || length > 3) {
                    throw new Exception('improperly formatted if-then-else');
                }

                let test = new Eval(this.ast.value.shift(), this.env).eval_ast();
                if (test.value !== 'nil' && test.value !== 'false') {
                    return new Eval(this.ast.value.shift(), this.env).eval_ast();
                } else if (length === 2) {
                    return new Type('nil');
                } else {
                    // TODO - why do we throw this value on the floor?  
                    this.ast.value.shift();
                    return new Eval(this.ast.value.shift(), this.env).eval_ast();
                }
                

            },
            'let*' : () => {
                let env = new Env(this.env),
                    bindings = this.ast.value.shift();
                
                if (bindings.value.length % 2 === 1) {
                    throw new Exception('poorly formatted binding list');
                }

                for (let i = 0; i < bindings.value.length; i += 2) {
                    env.set(bindings.value[i].value,
                            new Eval(bindings.value[i+1], env).eval_ast());
                }

                let ret = new Eval(this.ast.value.shift(), env).eval_ast();
                return ret;
            }
              */
/**
        

    
    while(ast) {
//        ast = build_ast(ast);

        if (ast.hasOwnProperty('type') && ast.type === 'list') {
            // New List to evaluate
            ast = apply(eval_ast.list(ast));
        } else if (Array.isArray(ast)) {
            // Evaluating elements of a list
            const current_element = ast.shift();
            const evaled_element = eval_ast[current_element.type]();
            call_stack.push(evaled_element);
        } else if (ast.type === 'symbol') {
            ast = eval_ast[ast.type]();
            break;
        } else {
            break;
        }
    }
*/

/* function eval_ast(ast, env, call_stack) {

    const ast_types = {
        'list'     : () => {
            const head = ast.value.shift();
            const operation = env.get(head.value);
            return {
                ast : [operation, ast],
                env : env,
                call_stack : call_stack
            };
        },
        'vector'   : () => {
            let list = this.ast.value,
                processed_list = [];
            for (let item of list) {
                let evaled_item = new Eval(item, this.env).eval_ast();
                processed_list.push(evaled_item);
            }
            this.ast.value = processed_list;
            return this.ast;
        },
        'hash-map' : () => {
            let key = this.ast.value.shift(),
                value = this.ast.value.shift();
            if (this.ast.value.length > 0 || (key.type !== 'string' && key.type !== 'keyword')) {
                throw Exception("Invalid hash-map!");
            } 
            let evaled_value = new Eval(value, this.env).eval_ast();
            this.ast.value = [key, evaled_value];
            return this.ast;
        },
        'symbol'   : () => {
            return env.get(ast.value);
        }
    };

    if (ast_types.hasOwnProperty(ast.type)) {
        return ast_types[ast.type]();
    } else {
        return {
            ast: ast,
            env: env,
            call_stack: call_stack
        };
    }
} */

export default Eval;

