'use strict';

function ASTNode(data) {
    this.data             = data,
    this.next_sibling     = null,
    this.previous_sibling = null,
    this.parent           = null,
    this.first_child      = null,
    this.last_child       = null;
    this.evaled           = null;
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

ASTNode.prototype.addNextChild = function(ast_node) {
    if (this.first_child === null) {
        this.addFirstChild(ast_node);
    } else {
        this.addLastChild(ast_node);
    }
};

/**
When we add a child node to a parent node with children, we need to
associate the siblings then assign and last child for the parent node
and the parent for the child node.
*/
ASTNode.prototype.addLastChild = function(ast_node) {
    ast_node.previous_sibling = this.last_child;
    this.last_child.next_sibling = ast_node;
    this.last_child = ast_node;
    ast_node.parent = this;
};

/**
When we remove the first child node, we need to update our references
in the parent and next sibling
*/
ASTNode.prototype.removeFirstChild = function() {
    let first_child = this.first_child;
    if (first_child.parent !== null){
    } else {
        this.first_child = null;
    }

    
    first_child.next_sibling = null;
    first_child.previous_sibling = null;
    first_child.parent = null;
    return first_child;
};

/**
When we remove the last child node, we need to update our references
in the parent and previous sibling
*/
ASTNode.prototype.removeLastChild = function() {
    let last_child = this.last_child;
    if (last_child.previous_sibling !== null) {
        last_child.previous_sibling.next_sibling = last_child.next_sibling;
    }
    last_child.parent.last_child = last_child.previous_sibling;
    last_child.next_sibling = null;
    last_child.previous_sibling = null;
    last_child.parent = null;
    return last_child;
};

/**
When we remove the next sibling node, we need to update our references
in the parent and previous sibling
*/
ASTNode.prototype.removeNextSibling = function() {
    let next_sibling = this.next_sibling;
    if (this.next_sibling.next_sibling === null) {
        this.parent.last_child = this;
    }
    this.next_sibling = this.next_sibling.next_sibling;
    next_sibling.previous_sibling.next_sibling = next_sibling.next_sibling;
    next_sibling.next_sibling = null;
    next_sibling.previous_sibling = null;
    next_sibling.parent = null;
    return next_sibling;
};

ASTNode.prototype.addNextSibling = function(ast_node) {
    ast_node.parent = this.parent;
    if (this.next_sibling === null) {
        ast_node.parent.last_child = ast_node;
    }
    ast_node.next_sibling = this.next_sibling;
    this.next_sibling = ast_node;
    ast_node.previous_sibling = this;
};


/*
ASTNode.prototype.addPreviousSibling = function(ast_node) {
    
};


ASTNode.prototype.removePreviousSibling = function() {};
ASTNode.prototype.removeNextSibling = function() {};
*/
export default ASTNode;

