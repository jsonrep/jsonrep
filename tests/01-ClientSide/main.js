#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "chrome"
    ],
    "test_runner": "mocha"
}
*/

describe("Suite", function() {

    require('bash.origin.workspace').LIB.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "routes": {
            "/": (
                '<head><script src="/lib/jsonrep.js"></script></head>' +
                '<body><div renderer="jsonrep">{"message": "Hello World!"}</div></body>'
            ),
            "/lib/jsonrep.js": {
                "@it.pinf.org.browserify#s1": {
                    "src": __dirname + "/../../src/jsonrep.js"
                }
            },
            "/dist/insight.rep.js": {
                "@it.pinf.org.browserify#s1": {
                    "src": __dirname + "/../../src/insight.rep.js",
                    "dist": __dirname + "/../../dist/insight.rep.js",
                    "format": "pinf"
                }
            }
        }
    });

    it('Test', function (client) {

        client.url('http://localhost:' + process.env.PORT + '/').pause(500);

        client.waitForElementPresent('BODY > DIV[renderer="jsonrep"]', 3000);

//if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
        
        client.expect.element('BODY > DIV[renderer="jsonrep"]').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
        
    });
});
