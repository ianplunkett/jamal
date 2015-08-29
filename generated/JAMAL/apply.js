/**
* Generated On: 2015-7-29
* Class: apply
*/

function apply(ast, env){
    //Constructor

    this.AST = ast;
    this.ENV = env;
    this.method_map = {
        'do'   : this.do_(),
        'fn*'  : this.fn_(),
        'if'   : this.if_(),
        'let*' : this.let_()
    };

    return this;
}


/**
* @specification: let*
*
*/
apply.prototype.let_ = function(){
    //TODO: Implement Me 

};


/**
* @specification: apply env
*
*/
apply.prototype.apply = function(){
    //TODO: Implement Me 

};


/**
* @specification: do
*
*/
apply.prototype.do_ = function(){
    //TODO: Implement Me 

};


/**
* @specification: if
*
*/
apply.prototype.if_ = function(){
    //TODO: Implement Me 

};


/**
* @specification: def!
*
*/
apply.prototype.def_ = function(){
    //TODO: Implement Me 

};


/**
* @specification: fn*
*
*/
apply.prototype.fn_ = function(){
    //TODO: Implement Me 

};



module.exports = {apply:apply};
