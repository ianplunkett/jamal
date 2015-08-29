'use strict';

import ASTNode   from './ASTNode.js';
import Exception from './Exception.js';
import Type      from './Type.js';

function Reader(tokens) {
    this.position = 0,
    this.tokens   = tokens;
    return this;
}

Reader.prototype.read_str = function() {
    let ast = this.read_form();

    if (this.tokens.length > this.position + 2) {
        throw new Exception('read_str: EOF Error - Invalid Syntax');
    } else if (this.tokens.length > this.position) {
        var comment = this.read_form();
        if (!comment.data.type === "comment-after-exp") {
            throw new Exception('read_str: EOF Error - Invalid Syntax');
        }
    }
    return ast;
};

/** next returns the token at the current position and increments the position. */
Reader.prototype.next = function() {
    if (this.position > this.tokens.length) {
        throw new Exception('EOF Error - Invalid Syntax');
    }
    var token = this.tokens[this.position];
    this.position++;
    return token;
};

/** peek just returns the token at the current position. */
Reader.prototype.peek = function() {
    return this.tokens[this.position];
};

Reader.prototype.read_form = function() {

    /** switch on complex types or default to atom processing */
    let current_token = this.peek(),
        typed_token   = new Type(current_token);

    switch (typed_token.form) {
        case 'list':
            /** List Form */
            return this.list(new ASTNode(typed_token));
            /** Key Value Form */
        case 'pair':
            return this.pair(new ASTNode(typed_token));
        default:
            /** Atom Form */
            return this.atom(typed_token);
    }
};

Reader.prototype.pair = function(ast) {
    this.next();
    ast.addNextChild(this.read_form());
    this.next();
    return ast;
};

Reader.prototype.list = function(ast_root) {

    let token = this.next();
    while (true) {
        if (this.peek() === ast_root.data.end) {
            break;
        } else {
            let ast_node  = this.read_form();
            ast_root.addNextChild(ast_node);
            token = this.next();
        }
    }
    return ast_root;
};

Reader.prototype.atom = function(typed_token) {
    return new ASTNode(typed_token);
};

export default Reader;
