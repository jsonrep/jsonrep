#!/usr/bin/env bash.origin.test via github.com/facebook/jest

const JSONREP = require("../..");


test('Test', function () {

    expect(JSONREP.markupNode('{"message":"Hello World!"}')).toBe('[' + JSON.stringify({
        "message": "Hello World!"
    }) + ']');
});
