'use strict';
let Exception = require('./exception.js'),
    Type = require('./type.js');

function Printer(malData, print_readably) {
    this.malData = malData;
    this.print_readably = print_readably;
    return this;
}


Printer.prototype.build_list_form = function(ast, is_child) {
    let output = '';

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
            output = output.concat(this.build_atom_form(child));
        } else {
            output = output.concat(this.build_atom_form(child))+" ";
        }
    }
    if (is_child) {
        return output.concat(ast.end+" ");
    } else {
        return output.concat(ast.end);
    }

};

Printer.prototype.build_pair_form = function(ast) {
    let output = '';
    output = output.concat(ast.begin+ " ");
    if (ast.value.form === 'list' || ast.value.form === 'pair') {
        output = output.concat(this.build_str(ast.value, false));
    } else {
        output = output.concat(ast.value.value);
    }
    return output.concat(ast.end);

};

Printer.prototype.build_atom_form = function(ast) {
    let output = '';
    if (ast.type === 'string' && !ast.hasOwnProperty('formatted') && this.print_readably === true) {
        ast = this.format_string(ast);
    }
    return output.concat(ast.value);
}

Printer.prototype.format_string = function(ast) {
    ast.value = ast.value.toString().replace(/\\/g, '\\\\');
    ast.value = ast.value.toString().replace(/"/g, '\\"');
    ast.formatted = true;
    return ast;
};

Printer.prototype.build_str = function(ast, is_child) {

    switch (ast.form) {
        case 'list':
            return this.build_list_form(ast);
        case 'pair':
            return this.build_pair_form(ast);
        case 'atom':
            return this.build_atom_form(ast);
        case 'closure':
            return '#<function>';
        default:
            return '';
    }

};

Printer.prototype.pr_str = function() {
    return this.build_str(this.malData, false);
};


module.exports = Printer;
