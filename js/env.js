function Env(outer, binds, exprs) {
    self = this;
    if (typeof binds === 'object' && binds.length > 0) {
        binds.map(
            function(currentValue, index, array) {
                self.set(currentValue, exprs[index]);
            }
        );
    }
    this.outer = outer;
    this.data = {};
    return this;
}

Env.prototype.set = function(key, value) {
    this.data[key] = value;
    return this;
};

Env.prototype.find = function(key) {
    if (this.data[key]) {
        return this.data[key];
    } else if (typeof this.outer === 'object') {
        return this.outer.find(key);
    } else {
        return 'symbol not found';
    }
};

Env.prototype.get = function(key) {
    return this.find(key);
};


module.exports = Env;
