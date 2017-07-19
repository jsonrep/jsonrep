
const RENDERERS = require("insight.renderers.default/lib/insight/pack");
const ENCODER = require("insight-for-js/lib/encoder/default");
const DECODER = require("insight-for-js/lib/decoder/default");
const DOMPLATE_UTIL = require("domplate/lib/util");
const UTIL = {
    copy: require("lodash/clone"),
    merge: require("lodash/merge"),
    importCssString:  function(cssText, doc, id) {
        doc = doc || document;
        
        if (typeof id !== "undefined") {
            if (doc.getElementById(id))
                return;
        }

        if (doc.createStyleSheet) {
            var sheet = doc.createStyleSheet();
            sheet.cssText = cssText;
        }
        else {
            var style = doc.createElementNS ?
                        doc.createElementNS("http://www.w3.org/1999/xhtml", "style") :
                        doc.createElement("style");
            if (typeof id !== "undefined")
            {
                style.setAttribute("id", id);
            }
            style.appendChild(doc.createTextNode(cssText));

            var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
            head.appendChild(style);
        }
    }
};

var commonHelpers = {
    helpers: null,
    // NOTE: This should only be called once or with an ID to replace existing
    importCssString: function(id, css, document) {
        UTIL.importCssString(css, document, "devcomp-insight-css-" + id);
    },
    util: UTIL.copy(DOMPLATE_UTIL),
    getTemplateForId: function(id) {
        throw new Error("NYI - commonHelpers.getTemplateForid (in " + module.id + ")");
    },
    getTemplateForNode: function (node) {
        if (!node) {
            throw new Error("No node specified!");
        }
        var template = RENDERERS.getTemplateForNode(node).getTemplate(this.helpers);
        return template;
    },
    getResourceBaseUrl: function (module) {

        // TODO: Optionally specify different URL
        return "dist/resources/insight.renderers.default/";
    },
    document: window.document,
    logger: window.console
};
commonHelpers.util.merge = UTIL.merge;


var encoder = ENCODER.Encoder();


exports.main = function (JSONREP, node) {

    var og = DECODER.generateFromMessage({
        meta: {},
        data: encoder.encode(node, {}, {})
    }, DECODER.EXTENDED);


    var helpers = Object.create(commonHelpers);
    helpers.helpers = helpers;
    helpers.debug = JSONREP.debug || false;
    helpers.dispatchEvent = function(name, args) {
throw new Error("STOP");
        if (typeof options.on[name] != "undefined")
            options.on[name](args[1].message, args[1].args);
    };


    var node = og.getOrigin();

    var template = RENDERERS.getTemplateForNode(node);

    return JSONREP.makeRep(
        '<div></div>',
        {
            on: {
                mount: function (el) {

                    template.renderObjectGraphToNode(node, el, {
                        view: ["detail"]
                    }, helpers);
                }
            }
        }
    );
}

