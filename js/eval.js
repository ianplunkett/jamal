'use strict';

const Env       = require('./env.js'),
      Exception = require('./exception.js'),
      Type      = require('./type.js');

function Eval(ast, env) {

    const apply = {};

    const special = {
        'def!' : () => {
            let first = this.ast.value.shift(),
                rest = this.ast.value.shift();
            if (this.ast.value.length > 0) {
                throw new Exception('improper special form invocation:' + first);
            }

            this.env.set(first.value, new Eval(rest, this.env).eval_ast());
            return this.env.get(first.value);
        },
        'do'   : () => {
            let length = this.ast.value.length,
                last;
            
            for(let i = 0; i < length; i++) {
                last = new Eval(this.ast.value.shift(), this.env).eval_ast();
            }
            return last;
        },
        'fn*'  : () => {
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
    };

    const eval_ast = {
        'list'     : () => {

            let list = this.ast.value,
                head = list.shift();

            if (this.special[head.value] === true) {
                return this.process_special(head.value);
            }
            
            let symbol_env = new Eval(head, this.env).eval_ast();
            return symbol_env.fn(list, this.env);
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
            return this.env.get(this.ast.value);
        }
    };
}

module.exports = Eval;

