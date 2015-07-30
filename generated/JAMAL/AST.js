'use strict';
/**
* Generated On: 2015-7-29
* Class: AST
*/

function AST(type, value){
    this.type = type;
    this.value = value;
}


/**
* @return AST {[object Object]} 
*/
AST.prototype.parent = function(){
    return false;
};


/**
* @return AST {[object Object]} 
*/
AST.prototype.children = function(){
    return false;
};


/**
* @return AST {[object Object]} 
*/
AST.prototype.left_sibling = function(){
    return false;
};


/**
* @return AST {[object Object]} 
*/
AST.prototype.right_sibling = function(){
    return false;
};



module.exports = AST;
