function Env() {
    return {
        '+': (a,b) => a+b,
        '-': (a,b) => a-b,
        '*': (a,b) => a*b,
        '/': (a,b) => parseInt(a/b)
    };
}

module.exports = Env;
