'use strict';

function ASTNode(type, value){
    this.type = type;
    this.value = value;
}


/**
* @return ASTNode {[object Object]} 
*/
ASTNode.prototype.parent = function(){
    
    return false;
};


/**
* @return ASTNode {[object Object]} 
*/
ASTNode.prototype.children = function(){
    return false;
};


/**
* @return ASTNode {[object Object]} 
*/
ASTNode.prototype.left_sibling = function(){
    return false;
};


/**
* @return ASTNode {[object Object]} 
*/
ASTNode.prototype.right_sibling = function(){
    return false;
};



module.exports = ASTNode;
