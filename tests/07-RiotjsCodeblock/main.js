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

    require('bash.origin.lib').js.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "routes": {
            "^/injectStyle/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "page": {
                        "@sample": {
                            "message": "Hello World"
                        }
                    },
                    "reps": {
                        "sample": __dirname + "/sample.rep.js"
                    }
                }
            },
            "^/loadStyle/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "externalizeCss": true,
                    "page": {
                        "@sample": {
                            "message": "Hello World"
                        }
                    },
                    "reps": {
                        "sample": __dirname + "/sample.rep.js"
                    }
                }
            }
        }
    });

    it('Test', function (client) {

        // TODO: Test by comparing screenshots so we can detect css changes.

        // Run as page
        client.url('http://localhost:' + process.env.PORT + '/injectStyle/').pause(500);
        client.waitForElementPresent('BODY', 3000);        
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));

        client.url('http://localhost:' + process.env.PORT + '/loadStyle/').pause(500);
        client.waitForElementPresent('BODY', 3000);        
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
    });
});
                