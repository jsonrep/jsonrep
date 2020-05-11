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
console.log('>>>TEST_IGNORE_LINE:Possible EventEmitter memory leak detected.<<<');

const LIB = require('bash.origin.lib').js;

describe("Suite", function() {

    this.timeout(30 * 1000);

    const server = LIB.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "mountPrefix": "/.tmp",
        "routes": {
            "^/injectStyle/": {
                "gi0.PINF.it/build/v0 # /injectStyle # /": {
                    "@jsonrep # router/v1": {
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
                }
            },
            "^/loadStyle/": {
                "gi0.PINF.it/build/v0 # /loadStyle # /": {
                    "@jsonrep # router/v1": {
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
        }
    });

    it('Test', async function (client) {

        const PORT = (await server).config.port;

        // TODO: Test by comparing screenshots so we can detect css changes.

        // Run as page
        client.url('http://localhost:' + PORT + '/injectStyle/page.html').pause(500);

//if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 30 * 1000);
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));

        client.url('http://localhost:' + PORT + '/loadStyle/page.html').pause(500);

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 30 * 1000);
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));
    });
});
                