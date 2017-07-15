#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "firefox"
    ],
    "test_runner": "mocha"
}
*/

describe('Hello World', function() {

    require('bash.origin.express').runForTestHooks(before, after, {
        "routes": {
            "/": (
                '<head><script src="/lib/jsonrep.js"></script></head>' +
                '<body><div renderer="jsonrep">{"message": "Hello World!"}</div></body>'
            ),
            "/lib/jsonrep.js": {
                "@it.pinf.org.browserify#s1": {
                    "src": __dirname + "/../../src/jsonrep.js"
                }
            }
        }
    });

    it('Test', function (client) {

        client.url('http://localhost:' + process.env.PORT + '/').pause(500);

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.expect.element('body').text.to.contain('<div renderer="jsonrep">[{"message": "Hello World!"}]</div>');
    });
});
