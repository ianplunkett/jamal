'use strict';
let Exception = require('./exception.js'),
    Type = require('./type.js');

function Printer(malData) {
    this.malData = malData;
    return this;
}

Printer.prototype.build_str = function(ast) {

    let output = '';

    // TOOD: we can't assume this will work. we are creating an array
    // of the object keys and blindly considering it as the only key.
    let type = new Type(ast);
    
    
    if (dataString.type === 'arithmetic') {
        return dataString.name;
    } else if (!Array.isArray(dataString) ) {
        return dataString;
    }
    output = output.concat('(');
    for (let i = 0; i < dataString.length; i++) {
        // If the current token is an array, recursively call this
        // function to build string. Otherwise, concat tokens with a space
        // character at the end.
        if (Array.isArray(dataString[i])) {
            output = output.concat(this.build_str(dataString[i]));
        } else if(i === dataString.length - 1) {
            output = output.concat(dataString[i]);
        } else {
            output = output.concat(dataString[i])+" ";
        }
    }
    output = output.concat(')');
    return output;
};

Printer.prototype.pr_str = function() {
    return this.build_str(this.malData);
};


module.exports = Printer;
