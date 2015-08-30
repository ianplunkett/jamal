# jamal

My implementation of https://github.com/kanaka/mal.  Not exactly a clone, but I am using the same guide and end to end tests.

## Installing Dependencies

jamal relies on transpiling to work in node and the web browser. To install dependencies, enter the root of the project and type:

```
npm install
```

## Building ES5 compatible javascript

jamal uses a few ES6 features which are not supported by node or any of the latest browsers.  The source code must be transpiled to work properly. To transpile the source, enter the root of the project and type:

```
gulp --gulpfile config/gulpfile.js babel
```

## Running end to end tests

jamal uses most of the tests from https://github.com/kanaka/mal. To run any of the tests for a particular step, enter the root of the project and type:

```
python runtest.py tests/<step n>.mal -- node out/cli/repl.js
```
Note: you must transpile the code before running any tests.

