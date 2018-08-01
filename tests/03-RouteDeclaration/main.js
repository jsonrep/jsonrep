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
            "^/jsonrep": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "page": {
                        "@announcer": {
                            "message": "Hello World!"
                        }
                    },
                    "reps": {
                        "announcer": function () {

                            exports.main = function (JSONREP, node) {

                                return "[" + node.message + "]"
                            };
                        }
                    }
                }
            },
            "/lib/loader.js": __dirname + "/../../node_modules/pinf-loader-js/loader.js",
            "/page.html": (
                '<head>' +
                    '<script src="/lib/loader.js"></script>' +
                    '<script>' +
                        'window.PINF.sandbox("/jsonrep.js", function (sandbox) {' +
                            'sandbox.main();' +
                        '}, console.error);' +
                    '</script>' +
                '</head>' +
                '<body></body>'
            )
        }
    });

    it('Test', function (client) {

        console.log('TEST_MATCH_IGNORE>>>');

        // Run as page
        client.url('http://localhost:' + process.env.PORT + '/jsonrep.html').pause(500);
        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            '[',
            'Hello World!',
            ']'
        ].join(""));

        // Run by requiring as PINF bundle into empty body
        client.url('http://localhost:' + process.env.PORT + '/page.html').pause(500);        
        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            '[',
            'Hello World!',
            ']'
        ].join(""));

        client.perform(function () {
            console.log('<<<TEST_MATCH_IGNORE');
        });

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
    });
});
