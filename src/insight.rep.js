
const REPS = require("insight.domplate.reps");
const ENCODER = require("insight-for-js/lib/encoder/default");
const DECODER = require("insight-for-js/lib/decoder/default");

var repsBaseUrl = "/reps";
if (typeof bundle !== "undefined") {
    repsBaseUrl = bundle.module.filename.replace(/\/[^\/]+\/[^\/]+$/, '/insight.domplate.reps');
}

var repLoader = new REPS.Loader({
    repsBaseUrl: repsBaseUrl
});

var encoder = ENCODER.Encoder();

exports.main = function (JSONREP, node) {

    var og = DECODER.generateFromMessage({
        meta: {},
        data: encoder.encode(node, {}, {})
    }, DECODER.EXTENDED);

    var repRenderer = new REPS.Renderer({
        loader: repLoader,
        onEvent: function (name, args) {

console.log('onEvent()', name, args);

        }
    });

    var rootNode = og.getOrigin();

    rootNode.meta = rootNode.meta || {};
    rootNode.meta.wrapper = 'wrappers/viewer';

    return JSONREP.makeRep(
        '<div></div>',
        {
            on: {
                mount: function (el) {

                    repRenderer.renderNodeInto(rootNode, el);
                }
            }
        }
    );
}
