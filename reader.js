'use strict';

function Reader(tokens) {
    this.tokens = tokens;
    this.position = 0;
    return this.read_str();
};

//next returns the token at the current position and increments the position.
Reader.prototype.next = function() {
    var token = this.tokens[this.position];
    this.position++;
    return token;
};

//peek just returns the token at the current position.
Reader.prototype.peek = function() {
    return this.tokens[this.position];
};

Reader.prototype.read_str = function() {
    let programData = this.read_form();
    if(!Array.isArray(programData)) {
        programData = [programData];
    }
    return programData;
};

Reader.prototype.read_form = function() {
    console.log('in form reader');
    var token = this.next();
    let malData = [];
    token = this.peek();
    console.log(token);

    if (token === '(') {
        malData = this.read_list();
    } else {
        malData = this.read_atom();
    }
    return malData;
};

Reader.prototype.read_list = function() {
    var list = [];
    var token = this.next();
    console.log('in list reader');
    list.push("(");
    while (token !== ')') {
        if (token !== '(') {
            list.push(token);
        }
        token = this.read_form();
    }
    list.push(token);
    return list;
};

Reader.prototype.read_atom = function() {
    var atom  = this.next();
    var regexp = /\d+/;
    if (regexp.test(atom)) {
        return parseInt(atom);
    } else {
        return atom;
    }
};


module.exports = Reader;
