/**
* Generated On: 2015-7-29
* Class: List
*/

var AST = require('./AST.js');

function List(){
    //Constructor


}

List.prototype = new AST();

List.prototype.children = function() {
    return new Array();
};

module.exports = List;
