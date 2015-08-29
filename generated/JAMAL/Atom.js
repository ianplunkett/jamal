'use strict';

const ASTNode = require('./ASTNode.js');

function Atom(){
    //Constructor
}

Atom.prototype = new ASTNode();

module.exports = Atom;
