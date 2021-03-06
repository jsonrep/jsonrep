#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "chrome"
    ],
    "test_runner": "mocha"
}
*/

console.log('>>>TEST_IGNORE_LINE:"GET /<<<');
console.log('>>>TEST_IGNORE_LINE:\\[bash.origin.express\\] Routing request /<<<');

describe("Suite", function() {

    require('bash.origin.lib').js.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "routes": {
            "^/reps1/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "page": {
                        "@list": {
                            "@pure": {},
                            "@variables": {
                                "message": "Hello World"
                            }
                        }
                    },
                    "reps": {
                        "list": __dirname + "/list.rep.js",
                        "pure": __dirname + "/pure.rep.js",
                        "variables": __dirname + "/variables.rep.js"
                    }
                }
            },
            "^/reps2/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "externalizeCss": true,
                    "page": {
                        "@list": {
                            "@pure": {},
                            "@variables": {
                                "message": "Hello World"
                            }
                        }
                    },
                    "reps": {
                        "list": __dirname + "/list.rep.js",
                        "pure": __dirname + "/pure.rep.js",
                        "variables": __dirname + "/variables.rep.js"
                    }
                }
            }
        }
    });

    it('Test', function (client) {

        // TODO: Test by comparing screenshots so we can detect css changes.

        // Run as page
        client.url('http://localhost:' + process.env.PORT + '/reps1/').pause(500);

//if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
        
        client.waitForElementPresent('BODY', 3000);        
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));

        client.url('http://localhost:' + process.env.PORT + '/reps2/').pause(500);        

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);        
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
    });
});
                