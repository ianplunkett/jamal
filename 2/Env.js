function Env(outer = {}) {

    this.outer = outer;

    this.data =  {
        '+': {
            type: 'arithmetic',
            value: (a,b) => a+b
        },
        '-': {
            type: 'arithmetic',
            value: (a,b) => a-b
        },
        '*': {
            type: 'arithmetic',
            value: (a,b) => a*b
        },
        '/': {
            type: 'arithmetic',
            value: (a,b) => parseInt(a/b)
        },
        'def!': {
            type: 'special',
            value: (a,b) => 'define a new symbol'
        },
        'let*': {
            type: 'special',
            value: (a,b) => false
        }
    };
    return this;
}

Env.prototype.set = function() {};

Env.prototype.find = function() {};

Env.prototype.get = function() {};


module.exports = Env;
