'use strict';

import ASTNode   from './ASTNode.js';
import Reader    from './Reader.js';
import Tokenizer from './Tokenizer.js';
import Printer   from './Printer.js';


function test_input_output() {

    // Data Inputs
    const text   = '(+ 10 (- 10 10))',
          text2  = '(+ 10 (- 10 10)))',
          reader = new Reader(new Tokenizer(text));

    // Method calls
    let ast_from_reader = reader.read_str();
    let out = new Printer(ast_from_reader).pr_str();

    // Assertions
    console.assert(out === text, "Input should match output");
    console.assert(out !== text2, "Input should not match output");
}

function test_create_ast_node() {
    const rootNode = new ASTNode({type: 'list'});
    console.assert(typeof rootNode === 'object');
    console.assert(typeof rootNode.data === 'object');
    console.assert(rootNode.next_sibling === null, "next_sibling should be null");
    console.assert(rootNode.previous_sibling === null, "previous_sibling should be null");
    console.assert(rootNode.first_child === null, "first_child should be null");
    console.assert(rootNode.last_child === null, "last_child should be null");
    console.assert(rootNode.parent === null, "parent should be null");
}
function test_ast_create_destroy_siblings() {
    const rootNode = new ASTNode({type: 'list'});

    rootNode.addNextChild(new ASTNode({type: 'symbol', value: '?'}));
    console.assert(rootNode.first_child.data.value === '?', "value should be '?'");
    const node = rootNode.first_child;

    node.addNextSibling(new ASTNode({type: 'symbol', value: '+'}));
    console.assert(node.next_sibling.data.value === '+', "next node value should be '+'");

    node.addNextSibling(new ASTNode({type: 'symbol', value: '-'}));
    console.assert(node.next_sibling.data.value === '-', "value should be '-'");
    console.assert(node.next_sibling.previous_sibling.data.value === '?', "previous value should be '?'");

    node.removeNextSibling();
    console.assert(node.next_sibling.data.value === '+', "value should be '+'");

}

function test_ast_create_destroy_children() {
    const rootNode = new ASTNode({type: 'list'});
    
    rootNode.addNextChild(new ASTNode({type: 'symbol', value: '+'}));
    console.assert(rootNode.last_child.data.value === '+', "value should be '+'");
    console.assert(rootNode.first_child.data.value === '+', "value should be '+'");
    
    rootNode.addNextChild(new ASTNode({type: 'integer', value: 10}));
    console.assert(rootNode.last_child.data.value === 10, "value should be 10");

    rootNode.addNextChild(new ASTNode({type: 'integer', value: 11}));
    console.assert(rootNode.last_child.data.value === 11, "value should be 11");

    rootNode.addNextChild(new ASTNode({type: 'integer', value: 12}));
    console.assert(rootNode.last_child.data.value === 12, "value should be 12");
    console.assert(rootNode.first_child.data.value === '+', "value should be '+'");

    rootNode.removeLastChild();
    console.assert(rootNode.last_child.data.value === 11, "value should be 11");
    rootNode.removeLastChild();
    console.assert(rootNode.last_child.data.value === 10, "value should be 10");
    rootNode.removeLastChild();
    console.assert(rootNode.last_child.data.value === '+', "value should be '+'");
    rootNode.removeLastChild();
    console.assert(rootNode.last_child === null, "last_child should be null");
}

function main() {
    test_input_output();
    test_create_ast_node();
    test_ast_create_destroy_children();
    test_ast_create_destroy_siblings();
}

main();
