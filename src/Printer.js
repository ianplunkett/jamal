'use strict';
import Exception from './Exception.js';
import Type      from './Type.js';

function Printer(ast, print_readably) {
    this.ast = ast;
    this.print_readably = print_readably;
    return this;
}


Printer.prototype.build_list_form = function(ast, is_child) {
    let output = '';

    //TODO - clean up the code to determine if we add a trailing space
    output = output.concat(ast.data.begin);
    let child = ast.first_child;
    while (child) {
        if (child.data.form === 'list' || child.data.form === 'pair') {
            output = output.concat(this.build_str(child, false));
        } else if (child.next_sibling === null) {
            output = output.concat(this.build_atom_form(child));
        } else {
            output = output.concat(this.build_atom_form(child))+" ";
        }
        child = child.next_sibling;
    }
    if (is_child) {
        return output.concat(ast.data.end+" ");
    } else {
        return output.concat(ast.data.end);
    }

};

Printer.prototype.build_pair_form = function(ast) {
    let output = '';
    output = output.concat(ast.data.begin+ " ");
    if (ast.first_child.data.form === 'list' || ast.first_child.data.form === 'pair') {
        output = output.concat(this.build_str(ast.first_child, false));
    } else {
        output = output.concat(ast.first_child.data.value);
    }
    return output.concat(ast.data.end);

};

Printer.prototype.build_atom_form = function(ast) {
    let output = '';
    if (ast.data.type === 'string' && !ast.data.hasOwnProperty('formatted') && this.print_readably === true) {
        ast = this.format_string(ast);
    } else if (ast.data.type === 'string' && !ast.data.hasOwnProperty('formatted') && this.print_readably === false) {
        ast = this.strip_string(ast);
    }
    return output.concat(ast.data.value);
};

Printer.prototype.strip_string = function(ast) {
    ast.value = ast.value.toString().replace(/^"/, '');
    ast.value = ast.value.toString().replace(/"$/, '');
    
    ast.formatted = true;
    return ast;
};

Printer.prototype.format_string = function(ast) {
    ast.value = ast.value.toString().replace(/\\/g, '\\\\');
    ast.value = ast.value.toString().replace(/"/g, '\\"');
    ast.formatted = true;
    return ast;
};

Printer.prototype.build_str = function(ast, is_child) {

    switch (ast.data.form) {
        case 'list':
            return this.build_list_form(ast, is_child);
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
    return this.build_str(this.ast, false);
};


export default Printer;
