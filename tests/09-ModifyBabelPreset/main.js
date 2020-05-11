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
console.log('>>>TEST_IGNORE_LINE:^Browserslist:<<<');
console.log('>>>TEST_IGNORE_LINE:Possible EventEmitter memory leak detected.<<<');

const LIB = require('bash.origin.lib').js;

describe("Suite", function() {

    const server = LIB.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "routes": {
            "^/": {
                "gi0.PINF.it/build/v0 # /dist # /": {
                    "@jsonrep # router/v1": {
                        "page": {
                            "@div": {
                                innerHTML: "Hello World!",
                                style: {
                                    border: "1px solid blue"
                                }
                            }
                        },
                        "reps": {
                            "div": __dirname + "/div.rep.js"
                        },
                        "babel": {
                            "presets": {
                                "@babel/preset-env": {
                                    // @see https://github.com/browserslist/browserslist
                                    "targets": "last 1 Chrome versions"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    it('Test', async function (client) {

        const PORT = (await server).config.port;

        // Run as page
        client.url('http://localhost:' + PORT + '/page.html').pause(500);        

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));
    });
});

