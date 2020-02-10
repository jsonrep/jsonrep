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

describe("Suite", function() {

    require('bash.origin.lib').js.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "routes": {
            "^/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "dist": __dirname + "/dist/page.js",
                    "prime": true,
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
    });

    it('Test', function (client) {

        // Run as page
        client.url('http://localhost:' + process.env.PORT + '/').pause(500);        
        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'Hello World!'
        ].join(""));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
    });
});

