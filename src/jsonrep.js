
function makeExports (exports) {

    const DEFAULT_RENDERER = require("./default.rep");

    var reps = {};
    var repIndex = 0;

    exports.debug = false;

    exports.getRepForId = function (id) {
        return reps[id] || null;
    }

    exports.makeRep = function (html, rep) {
        // TODO: Speed this up.
        html = html.split("\n");
        // Inject a reference attribute into the HTML so we can attach the event listeners after injection.
        var match = html[0].match(/^(<\w+)(.+)$/);
        if (!match) {
            throw new Error("The 'html' for a rep must begin with a HTML tag!");
        }
        html[0] = match[1] + ' _repid="' + (++repIndex) + '" ' + match[2];
        // TODO: Garbage collect old reps when they are re-rendered.
        reps["" + repIndex] = rep;
        return html.join("\n");
    }

    exports.markupNode = function (node) {

        if (typeof node === "string") {
            try {
                node = JSON.parse(node);
            } catch (err) {
                return Promise.reject(new Error("Error parsing node from string! (" + err.message + ")"));
            }
        }

		var keys = Object.keys(node);
		if (
			keys.length === 1 &&
			/^@/.test(keys[0])
		) {
            var uri = keys[0].replace(/^@/, "") + ".rep";
            
            return exports.loadRenderer(uri).then(function (renderer) {

                return renderer.main(exports, node[keys[0]]);
            });

        } else {

            return Promise.resolve(DEFAULT_RENDERER.main(exports, node));
        }
    }
}

((function (WINDOW) {

    var isCommonJS = (typeof exports !== "undefined");

    if (!isCommonJS) {
        var exports = {};
    }

    makeExports(exports);

    if (!WINDOW) {

        // TODO: Shim 'PINF' loader to enable loading server-side.

        return null;
    }

    if (!isCommonJS) {
        WINDOW.jsonrep = exports;
    }

    if (typeof WINDOW.PINF === "undefined") {
        WINDOW.PINF = require("pinf-loader-js");
        WINDOW.PINF.document = WINDOW.document;
    }

    exports.loadRenderer = function (uri) {
        return new Promise(function (resolve, reject) {
            WINDOW.PINF.sandbox(uri, resolve, reject);
        });
    }

    exports.markupElement = function (el) {
        return exports.markupNode(el.innerHTML).then(function (htmlCode) {

            el.innerHTML = htmlCode;

            var rep = exports.getRepForId(el.childNodes[0].getAttribute("_repid"));
            if (
                rep &&
                rep.on &&
                rep.on.mount
            ) {
                rep.on.mount(el.childNodes[0]);
            }
            return null;
        });
    }

    exports.markupDocument = function () {
        return Promise.all(Array.from(WINDOW.document.querySelectorAll('[renderer="jsonrep"]')).map(exports.markupElement));
    }

    function markupDocument () {
        // TODO: Optionally direct to custom error handler.
        exports.markupDocument().catch(console.error);
    }

    if (WINDOW.document.readyState === "complete") {
        markupDocument()
    } else {
        if (typeof WINDOW.addEventListener !== "undefined") {
            WINDOW.addEventListener("DOMContentLoaded", markupDocument, false);
        } else {
            WINDOW.attachEvent("onload", markupDocument);
        }
    }

})(
    (typeof window !== "undefined") ? window : null
));
