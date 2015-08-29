'use strict';
import Exception from './Exception.js';
import Type      from './Type.js';
    
function Env(outer, binds, exprs) {
    this.outer = outer;
    this.data = {};
    let self = this;

    if (typeof binds === 'object' && binds.length > 0) {
        for (let i = 0; i < binds.length; + i++) {
            if (binds[i].value === '&') {
                // TODO - we should not be constructing this object
                // here. should be called externally.
                let exprs_list = {
                    type: 'list',
                    form: 'list',
                    value: exprs.slice(i)
                };
                self.set(binds[i + 1].value, exprs_list);
                break;
            }
            self.set(binds[i].value, exprs[i]);
        }
    }
    /*
  
        binds.map(
            function(currentValue, index, array) {
                self.set(currentValue.value, exprs[index]);
            }
        );

*/
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
        throw Exception("symbol not found");
    }
};

Env.prototype.get = function(key) {
    return this.find(key);
};


export default Env;
