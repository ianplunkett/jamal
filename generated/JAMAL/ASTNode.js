'use strict';

function ASTNode(data) {
    this.data        = data,
    this.next        = null,
    this.previous    = null,
    this.parent      = null,
    this.first_child = null,
    this.last_child  = null;
}

ASTNode.prototype.addFirstChild = function(ast_node) {
    this.first_child = ast_node;
    this.last_child = ast_node;
    ast_node.parent = this;
};

ASTNode.prototype.addNextChild = function(ast_node) {
    ast_node.previous = this.last_child;
    this.last_child.next = ast_node;
    this.last_child = ast_node;
    ast_node.parent = this;
};

const proto = ASTNode.prototype;
/**
Object.defineProperty(proto, "value", {
    get: ()       => this.value,
    set: (value)  => this.value = value
});

Object.defineProperty(proto, "parent", {
    get: ()       => this.parent,
    set: (parent) => this.parent = parent
});

Object.defineProperty(proto, "previous", {
    get: ()     => this.previous,
    set: (previous) => this.previous = previous
});

Object.defineProperty(proto, "next", {
    get: ()      => this.next,
    set: (next) => this.next = next
});

Object.defineProperty(proto, "first_child", {
    get: ()     => this.first_child,
    set: (first_child) => this.first_child = first_child
});

Object.defineProperty(proto, "last_child", {
    get: ()      => this.last_child,
    set: (last_child) => this.last_child = last_child
});
*/
module.exports = ASTNode;
