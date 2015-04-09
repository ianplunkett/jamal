'use strict';
var Exception = require('./exception.js');

function Env(outer) {
    this.outer = outer;
    this.data = {};
    return this;
}

Env.prototype.set = function(key, value) {
    this.data[key] = value;
    return this;
};

Env.prototype.find = function(key) {
    if (typeof this.data[key] !== 'undefined') {
        return this.data[key];
    } else if (typeof this.outer !== 'undefined') {
        return this.outer.find(key);
    } else {
        return false;
    }
};

Env.prototype.get = function(key) {
    console.log(this);
    let value  = this.find(key);
    if (typeof value === 'undefined') {
        throw new Exception('Key not found');
    }
    return value;
};

module.exports = Env;
