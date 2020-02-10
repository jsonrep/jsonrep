#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "chrome"
    ],
    "test_runner": "mocha"
}
*/

console.log('>>>TEST_IGNORE_LINE:\"GET /<<<');
console.log('>>>TEST_IGNORE_LINE:\\[bash.origin.express\\] Routing request /<<<');
console.log('>>>TEST_IGNORE_LINE:Connecting to localhost on port<<<');
console.log('>>>TEST_IGNORE_LINE:^[\\s\\t]*$<<<');

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
                    },
                    "include": {
                        "riot.js": true
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
                    },
                    "include": {
                        "riot.min.js": true
                    }
                }
            }
        }
    });

    it('Test', function (client) {

        // TODO: Test by comparing screenshots so we can detect css changes.

        // Run as page
        client.url('http://localhost:' + process.env.PORT + '/injectStyle/').pause(500);

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

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
                