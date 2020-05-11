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
console.log('>>>TEST_IGNORE_LINE:Writing to:<<<');
console.log('>>>TEST_IGNORE_LINE:Run tool step for:<<<');
console.log('>>>TEST_IGNORE_LINE:MaxListenersExceededWarning:<<<');
console.log('>>>TEST_IGNORE_LINE:Adding route:<<<');

const LIB = require('bash.origin.lib').js;

describe("Suite", function() {

    this.timeout(60 * 60 * 1000);

    const server = LIB.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "mountPrefix": "/.tmp",
        "routes": {
            "^/reps1/": {
                "gi0.PINF.it/build/v0 # /jsonrep1 # /": {
                    "@jsonrep # router/v1": {
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
            },
            "^/reps2/": {
                "gi0.PINF.it/build/v0 # /jsonrep2 # /": {
                    "@jsonrep # router/v1": {
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
        }
    });

    it('Test', async function (client) {

        const PORT = (await server).config.port;

        // TODO: Test by comparing screenshots so we can detect css changes.

        // Run as page
        client.url('http://localhost:' + PORT + '/reps1/page.html').pause(500);

//if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);        
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));

        client.url('http://localhost:' + PORT + '/reps2/page.html').pause(500);        

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);        
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
    });
});
                