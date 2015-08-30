'use strict';
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
            throw new Exception('read_str: EOF Error2 - Invalid Syntax');
        }
    }
    return ast;
};

/** next returns the token at the current position and increments the position. */
Reader.prototype.next = function() {
    if (this.position > this.tokens.length) {
        throw new Exception('EOF Error - Invalid Syntax');
    }
    let token = this.tokens[this.position];
    this.position++;
    return token;
};

/** peek just returns the token at the current position. */
Reader.prototype.peek = function() {
    return this.tokens[this.position];
};

Reader.prototype.read_form = function() {

    /** switch on complex types or default to atom processing */
    const token = this.peek(),
          ast   = new ASTNode(token);

    switch (token.form) {
        case 'list':
            /** List Form */
            return this.list(ast);
            /** Key Value Form */
        case 'pair':
            return this.pair(ast);
        default:
            /** Atom Form */
            return ast;
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
        if (this.peek().value === ast_root.data.end) {
            break;
        } else {
            const ast_node = this.read_form();
            ast_root.addNextChild(ast_node);
            token = this.next();
        }
    }
    return ast_root;
};

export default Reader;
