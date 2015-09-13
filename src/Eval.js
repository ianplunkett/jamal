'use strict';

import Env       from './Env.js';
import Exception from './Exception.js';
import Type      from './Type.js';

function Eval(ast, env){

    do {
        [ast, env] = eval_ast(ast, env);
        [ast, env] = apply(ast, env);
        // TODO Remove this when we get to better defintions for pair forms
        if (ast.data.form === 'pair') {
            break;
        }
    } while (ast.evaled === null || ast.parent !== null)

    return ast;
}

function eval_symbol(ast, env) {
    ast.data.value = env.get(ast.data.value);
    return [ast, env];
}

function eval_list(ast, env) {
    if (!ast.evaled) {
        return [ast.first_child, env];
    } else if (ast.parent !== null) {
        return [ast.parent, env];
    } else {
        return [ast, env];
    }

}

function eval_vector(ast, env) {
    if (!ast.evaled) {
        return [ast.first_child, env];
    } else if (ast.parent !== null) {
        return [ast.parent, env];
    } else {
        return [ast, env];
    }
}

function eval_hash_map(ast, env) {
    if (!ast.evaled) {
        return [ast.first_child, env];
    } else if (ast.parent !== null) {
        return [ast.parent, env];
    } else {
        return [ast, env];
    }
}

function eval_atom(ast, env) {
    if (!ast.evaled && ast.next_sibling !== null) {
        return [ast, env];
    } else if (ast.parent !== null) {
        ast.parent.evaled = true;
        return [ast, env];
    } else {
        ast.evaled = true;
        return [ast, env];
    }

}

function eval_ast(ast, env) {

    const type = ast.data.type;

    switch(type) {
        case "symbol":
            return eval_symbol(ast, env);
        case "list":
            return eval_list(ast, env);
        case "vector":
            return eval_vector(ast, env);
        case "hash-map":
            return eval_hash_map(ast, env);
        default:
            return eval_atom(ast, env);
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
    const variable = ast.next_sibling;
    const value = variable.next_sibling;
    if (value.data.form === 'list' && value.evaled !== true) {
        return [value, env];
    } else {
        const parent = variable.parent;
        parent.data = variable.data;
        parent.removeLastChild();
        parent.removeLastChild();
        parent.removeFirstChild();
        env.set(parent.data.value, value);
        parent.data.type = 'string';
        return [parent, env];
    }
}

function apply_fn(ast,env) {
    ast = null;
    return [ast, env];
}

function apply_env(ast, env) {

    if (ast.data.type !== 'symbol') {
        if (ast.next_sibling !== null) {
            return [ast.next_sibling, env];
        } else if (ast.parent !== null && ast.first_child === null) {
            ast.parent.evaled = true;
            return [ast.parent, env];
        } else {
            ast.evaled = true;
            return [ast, env];
        }
    } else {
        // TODO we are already doing this in eval_ast. needs a refactor
        const symbol = ast.data.value,
              apply  = env.get(symbol);
        [ast, env] = apply(ast.next_sibling, env);
        return [ast, env];
    }
}

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

export default Eval;
