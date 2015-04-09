'use strict';
var util = require('util');

function Printer(malData) {
    this.malData = malData;
    return this;
}

Printer.prototype.build_str = function(dataString) {

    let output = '';
    if (!Array.isArray(dataString) ) {
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
    let output = this.build_str(this.malData);
    return output;
};


module.exports = Printer;
