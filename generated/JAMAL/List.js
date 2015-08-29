'use strict';

const ASTNode = require('./ASTNode.js');

function List(){
    //Constructor


}

List.prototype = new ASTNode();

List.prototype.children = function() {
    return new Array();
};

module.exports = List;
