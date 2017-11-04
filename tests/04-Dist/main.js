#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "chrome"
    ],
    "test_runner": "mocha"
}
*/

const PATH = require("path");
const FS = require("fs-extra");

const DIST_BASE_PATH = PATH.join(__dirname, ".dist");


describe("Suite", function() {

    if (FS.existsSync(DIST_BASE_PATH)) {
        FS.removeSync(DIST_BASE_PATH);
    }

    require('bash.origin.express').runForTestHooks(before, after, {
        "routes": {
            "^/jsonrep/page": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "dist": PATH.join(DIST_BASE_PATH, "page.html"),
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
            "^/jsonrep/bundle": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "dist": PATH.join(DIST_BASE_PATH, "bundle.js"),
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
            "/lib/loader.js": __dirname + "/../../node_modules/pinf-loader-js/loader.js",
            "/page.html": (
                '<head>' +
                    '<script src="/lib/loader.js"></script>' +
                    '<script>' +
                        'window.PINF.sandbox("/jsonrep/bundle.js", function (sandbox) {' +
                            'sandbox.main();' +
                        '}, console.error);' +
                    '</script>' +
                '</head>' +
                '<body></body>'
            ),
            "^/dist/": DIST_BASE_PATH,
            "/dist_bundle_page.html": (
                '<head>' +
                    '<script src="/lib/loader.js"></script>' +
                    '<script>' +
                        'window.PINF.sandbox("/dist/bundle.js", function (sandbox) {' +
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
        client.url('http://localhost:' + process.env.PORT + '/jsonrep/page.html').pause(500);        
        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

        // Run by requiring as PINF bundle into empty body
        client.url('http://localhost:' + process.env.PORT + '/page.html').pause(500);        
        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

        // Now test dist files

        client.url('http://localhost:' + process.env.PORT + '/dist/page.html').pause(500);        
        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

        client.url('http://localhost:' + process.env.PORT + '/dist_bundle_page.html').pause(500);        
        client.waitForElementPresent('BODY', 3000);
        client.expect.element('BODY').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
        
    });
});

