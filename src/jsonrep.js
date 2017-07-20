
function makeExports (exports) {

    var reps = {};
    var repIndex = 0;


    var ourBaseUri = Array.from(document.querySelectorAll('SCRIPT[src]')).filter(function (tag) {
        return /\/jsonrep(\.min)?\.js$/.test(tag.getAttribute("src"));
    });
    if (!ourBaseUri.length) {
        ourBaseUri = "";
    } else {
        ourBaseUri = ourBaseUri[0].getAttribute("src").split("/").slice(0, -2).join("/");
    }


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

        var uri = null;
		var keys = Object.keys(node);
		if (
			keys.length === 1 &&
			/^@/.test(keys[0])
		) {
            uri = keys[0].replace(/^@/, "") + ".rep";
            node = node[keys[0]];
        } else {
            uri = "./dist/insight.rep.js";
        }

        if (/^dist\//.test(uri)) {
            uri = ourBaseUri + "/" + uri;
        }

        return exports.loadRenderer(uri).then(function (renderer) {

            return renderer.main(exports, node);
        });
    }
}

((function (WINDOW) {

    const isCommonJS = (typeof exports !== "undefined");

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
