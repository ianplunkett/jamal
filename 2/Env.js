function Env() {
    return {
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
}

module.exports = Env;
