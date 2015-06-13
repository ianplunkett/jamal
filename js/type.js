function Type() {

    /**
     Type Classes:
        - Atom Type
        - Key/Value Type
        - List Type
        - W/meta???
     */
    
    return {
        
        // Working properly
        "nil"                : /^nil$/,
        "boolean"            : /^true|false$/,
        "integer"            : /^\d+$/,
        "string"             : /^".*"$/,
        "whole-line-comment" : /^;;/,

        // Complex data types, treat as key/value pair
        "quote"              : /^'/,
        "quasiquote"         : /^`/,
        "unquote"            : /^~/,
        "splice-unquote"     : /^~@/,
        "comment-after-exp"  : /^;.*$/,
        "deref"              : /^@/,

        // TODO: map unicode internal representation 0x29E 
        "keyword"            : /^:/,

        // TODO: I don't really understand this one yet...
        "with-meta"          : /^\^/
    };

}

Type.prototype.form = function() {
    
};

Type.prototype.ast = function() {
    
};

module.exports = Type;
