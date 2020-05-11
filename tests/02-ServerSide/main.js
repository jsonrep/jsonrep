#!/usr/bin/env bash.origin.test via github.com/mochajs/mocha

const ASSERT = require('assert');
const JSONREP = require("../..");


it('Test', async function () {

    const code = await JSONREP.markupNode('{"message":"Hello World!"}');

    ASSERT.equal(code, JSON.stringify({
        "message": "Hello World!"
    }, null, 4));

});
