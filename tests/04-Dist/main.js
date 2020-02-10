#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "chrome"
    ],
    "test_runner": "mocha"
}
*/

const LIB = require('bash.origin.lib').js;

const PATH = LIB.path;
const FS = LIB.FS_EXTRA;

const DIST_BASE_PATH = PATH.join(__dirname, ".dist");


console.log('>>>TEST_IGNORE_LINE:\"GET /<<<');
console.log('>>>TEST_IGNORE_LINE:\\[bash.origin.express\\] Routing request /<<<');
console.log('>>>TEST_IGNORE_LINE:Connecting to localhost on port<<<');
console.log('>>>TEST_IGNORE_LINE:^[\\s\\t]*$<<<');


describe("Suite", function() {

    if (FS.existsSync(DIST_BASE_PATH)) {
        FS.removeSync(DIST_BASE_PATH);
    }

    LIB.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "routes": {
            "^/jsonrep/page/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "dist": PATH.join(DIST_BASE_PATH, "page/index.html"),
                    "prime": true,
                    "page": {
                        "@announcer": {
                            "message": "Hello World!"
                        }
                    },
                    "reps": {
                        "announcer": function () {

                            exports.main = function (JSONREP, node) {

                                return JSONREP.markupNode(node);
                            };
                        }
                    }
                }
            },
            "^/jsonrep/bundle/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "dist": PATH.join(DIST_BASE_PATH, "bundle/page.js"),
                    "prime": true,
                    "page": {
                        "@announcer": {
                            "message": "Hello World!"
                        }
                    },
                    "reps": {
                        "announcer": function () {

                            exports.main = function (JSONREP, node) {

                                return JSONREP.markupNode(node);
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
                        'window.PINF.sandbox("/jsonrep/bundle/page.js", function (sandbox) {' +
                            'sandbox.main();' +
                        '}, console.error);' +
                    '</script>' +
                '</head>' +
                '<body></body>'
            ),
            "^/dist/": DIST_BASE_PATH,
            "/dist_bundle_page.html": (
                '<head>' +
                    '<script src="/lib/loader-core.browser.js"></script>' +
                    '<script>' +
                        'window.PINF.sandbox("/dist/bundle/page.js", function (sandbox) {' +
                            'sandbox.main();' +
                        '}, console.error);' +
                    '</script>' +
                '</head>' +
                '<body></body>'
            )            
        }
    });

    it('Test', function (client) {

        // Run as page
        client.url('http://localhost:' + process.env.PORT + '/jsonrep/page/').pause(500);

//if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

        // Run by requiring as PINF bundle into empty body
        client.url('http://localhost:' + process.env.PORT + '/page.html').pause(500);

//if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

        // Now test dist files

        client.url('http://localhost:' + process.env.PORT + '/dist/page/index.html').pause(500);

//if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

        client.url('http://localhost:' + process.env.PORT + '/dist_bundle_page.html').pause(500);

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

//        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

    });
});

