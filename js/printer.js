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
    switch (ast.form) {
        case 'list':
            output = output.concat(ast.begin);
            for (let child of ast.value) {
                if (child.form === 'list' || child.form === 'pair') {
                    output = output.concat(this.build_str(child));
                } else if (ast.value.length - 1 === ast.value.indexOf(child)) {
                    output = output.concat(child.value);
                } else {
                    output = output.concat(child.value)+" ";
                }
            }
            return output.concat(ast.end);
        case 'pair':
            output = output.concat(ast.begin+ " ");
            if (ast.value.form === 'list' || ast.value.form === 'pair') {
                output = output.concat(this.build_str(ast.value));
            } else {
                output = output.concat(ast.value.value);
            }
            return output.concat(ast.end);
        case 'atom':
            return output.concat(ast.value);
    }

    return output;
};

Printer.prototype.pr_str = function() {
    return this.build_str(this.malData);
};


module.exports = Printer;
