#!/usr/bin/env bash.origin.test via github.com/mochajs/mocha

const ASSERT = require('assert');
const JSONREP = require("../..");


it('Test', function (done) {

    JSONREP.markupNode('{"message":"Hello World!"}').then(function (code) {

        ASSERT.equal(code, JSON.stringify({
            "message": "Hello World!"
        }, null, 4));

        done();
        return null;
    }).catch(done);
});
