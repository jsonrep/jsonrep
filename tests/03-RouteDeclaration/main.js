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

    const server = LIB.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "mountPrefix": "/.tmp",
        "routes": {
            "^/jsonrep/": {
                "gi0.PINF.it/build/v0 # /jsonrep # /": {
                    "@jsonrep # router/v1": {
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

    it('Test', async function (client) {

        const PORT = (await server).config.port;

        console.log('TEST_MATCH_IGNORE>>>');

        // Run as page
        client.url('http://localhost:' + PORT + '/jsonrep/page.html').pause(500);

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain(
            '[Hello World!]'
        );

        // Run by requiring as PINF bundle into empty body
        client.url('http://localhost:' + PORT + '/page.html').pause(500);

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
