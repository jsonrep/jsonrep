
const RIOT = require("riot");



exports.processSync = function (codeblock) {

    var js = RIOT.compile([
        '<tag>',
        codeblock.getCode(),
        '</tag>'
    ].join("\n"), {});
    
    return [
        'function (context) {',
            'return {',
                'html: "<div></div>",',
                '"on": {',
                    '"mount":' + ((function (el) {

                        "%%JS%%"

                        riot.mount(el, 'tag', context);

                    }).toString()
                        .replace(/"%%JS%%"/, js)),
                '}',
            '};',
        '}'
    ].join("\n");
}
