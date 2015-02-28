'use strict';
var util = require('util');

function Printer(malData) {
    this.malData = malData;
    return this;
}

Printer.prototype.build_str = function(dataString) {

    let output = '';
    console.log(dataString);
    for (let i = 0; i < dataString.length; i++) {
        // If the current token is an array, recursively call this
        // function to build string. Otherwise, concat tokens with a space
        // character at the end.
        console.log("in string builder");
        if (Array.isArray(dataString[i])) {
            output = output.concat("("+this.build_str(dataString[i])+")");
        } else {
            output = output.concat(dataString[i])+" ";
        }
    }
    return output;
};

Printer.prototype.pr_str = function() {
    console.log('in string printer');
    let output = this.build_str(this.malData);
    
    console.log(output);
};


module.exports = Printer;
