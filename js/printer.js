'use strict';
let Exception = require('./exception.js'),
    Type = require('./type.js');

function Printer(malData) {
    this.malData = malData;
    return this;
}

Printer.prototype.build_str = function(ast, is_child) {

    let output = '';

    switch (ast.form) {
        case 'list':
            //TODO - clean up the code to determine if we add a trailing space
            output = output.concat(ast.begin);
            for (let child of ast.value) {
                if (child.form === 'list' || child.form === 'pair') {
                    if (ast.value.length - 1 === ast.value.indexOf(child)) {
                        output = output.concat(this.build_str(child, false));
                    } else {
                        output = output.concat(this.build_str(child, true));
                    }
                } else if (ast.value.length - 1 === ast.value.indexOf(child)) {
                    output = output.concat(child.value);
                } else {
                    output = output.concat(child.value)+" ";
                }
            }
            if (is_child) {
                return output.concat(ast.end+" ");
            } else {
                return output.concat(ast.end);
            }
        case 'pair':
            output = output.concat(ast.begin+ " ");
            if (ast.value.form === 'list' || ast.value.form === 'pair') {
                output = output.concat(this.build_str(ast.value, false));
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
    return this.build_str(this.malData, false);
};


module.exports = Printer;
