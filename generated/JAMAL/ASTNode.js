'use strict';

function ASTNode(data) {
    this.data        = data,
    this.next        = null,
    this.previous    = null,
    this.parent      = null,
    this.first_child = null,
    this.last_child  = null;
}

/**
When we add a child node to a parent node without any children, we
need to assign both the first and last child for the parent node and
the parent for the child node.
*/
ASTNode.prototype.addFirstChild = function(ast_node) {
    this.first_child = ast_node;
    this.last_child = ast_node;
    ast_node.parent = this;
};

/**
When we add a child node to a parent node with children, we need to
associate the siblings then assign and last child for the parent node
and the parent for the child node.
*/
ASTNode.prototype.addNextChild = function(ast_node) {
    ast_node.previous = this.last_child;
    this.last_child.next = ast_node;
    this.last_child = ast_node;
    ast_node.parent = this;
};

/**
When we remove the first child node, we need to update our references
in the parent and next sibling
*/
ASTNode.prototype.removeFirstNode = function() {
    let first_child = this.first_child;
    first_child.next.previous = first_child.previous;
    first_child.parent.first_child = first_child.next;
    first_child.next = null;
    first_child.previous = null;
    first_child.parent = null;
    return first_child;
};

/**
When we remove the last child node, we need to update our references
in the parent and previous sibling
*/
ASTNode.prototype.removeLastNode = function() {
    let last_child = this.last_child;
    last_child.previous.next = last_child.next;
    last_child.parent.last_child = last_child.previous;
    last_child.next = null;
    last_child.previous = null;
    last_child.parent = null;
    return last_child;
};

module.exports = ASTNode;
