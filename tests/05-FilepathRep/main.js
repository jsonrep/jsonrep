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

    require('bash.origin.express').runForTestHooks(before, after, {
        "routes": {
            "^/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "page": {
                        "@announcer": {
                            "message": "Hello World!"
                        }
                    },
                    "reps": {
                        "announcer": __dirname + "/announcer.rep.js"
                    }
                }
            }
        }
    });

    it('Test', function (client) {

        client.url('http://localhost:' + process.env.PORT + '/').pause(500);
 
        client.waitForElementPresent('BODY', 3000);

        client.expect.element('BODY').text.to.contain([
            '[',
            'Hello World!',
            ']'
        ].join(""));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
        
    });
});
