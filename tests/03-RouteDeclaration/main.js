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
            "^/jsonrep/": {
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
            "/lib/loader-core.browser.js": require.resolve("pinf-loader-js/dist/loader-core.browser.js"),
            "/page.html": (
                '<head>' +
                    '<script src="/lib/loader-core.browser.js"></script>' +
                    '<script>' +
                        'window.PINF.sandbox("/jsonrep/page.js", function (sandbox) {' +
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
        client.url('http://localhost:' + process.env.PORT + '/jsonrep/').pause(500);

//if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain(
            '[Hello World!]'
        );

        // Run by requiring as PINF bundle into empty body
        client.url('http://localhost:' + process.env.PORT + '/page.html').pause(500);

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain(
            '[Hello World!]'
        );

        client.perform(function () {
            console.log('<<<TEST_MATCH_IGNORE');
        });

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
    });
});
