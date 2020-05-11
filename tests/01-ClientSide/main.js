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

    this.timeout(60 * 1000);

    const server = LIB.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "routes": {
            "/": (
                '<head>' +
                    '<script src="/test-reps/dist/jsonrep.js"></script>' +
                '</head>' +
                '<body><div renderer="jsonrep">{"message": "Hello World!"}</div></body>'
            ),
            "^/test-reps/": {
                "gi0.PINF.it/build/v0 # /.tmp # /": {
                    "@jsonrep # router/v1": {
                    }
                }
            }
        }
    });

    it('Test', async function (client) {

        const PORT = (await server).config.port;

        client.url('http://localhost:' + PORT + '/').pause(500);

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        client.waitForElementPresent('BODY > DIV[renderer="jsonrep"]', 3000);

        client.expect.element('BODY > DIV[renderer="jsonrep"]').text.to.contain([
            'map(',
            'message=>Hello World!',
            ')'
        ].join("\n"));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
        
    });
});
