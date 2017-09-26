
function makeExports (exports) {

    var reps = {};
    var repIndex = 0;

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
                console.error("This should be JSON:", node);
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
            if (exports.options.defaultRenderer) {
                return new Promise(function (resolve, reject) {
                    try {
                        var ret = exports.options.defaultRenderer(exports, node);
                        if (typeof ret.then === "function") {
                            ret.then(resolve, reject);
                        } else {
                            resolve(ret);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            } else {
                uri = "dist/insight.rep.js";
            }
        }

        if (/^dist\//.test(uri)) {
            uri = exports.options.ourBaseUri + "/" + uri;
        }

        return exports.loadRenderer(uri).then(function (renderer) {

            return renderer.main(exports, node);
        });
    }
}

((function (WINDOW) {

    function init (exports) {

        exports.options = exports.options || {};

        exports.PINF = require("pinf-loader-js");

        if (WINDOW) {

            if (!exports.options.ourBaseUri) {
                var ourBaseUri = Array.from(WINDOW.document.querySelectorAll('SCRIPT[src]')).filter(function (tag) {
                    return /\/jsonrep(\.min)?\.js$/.test(tag.getAttribute("src"));
                });
                if (!ourBaseUri.length) {
                    exports.options.ourBaseUri = "";
                } else {
                    exports.options.ourBaseUri = ourBaseUri[0].getAttribute("src").split("/").slice(0, -2).join("/");
                }
            }

            if (typeof WINDOW.PINF === "undefined") {
                WINDOW.PINF = exports.PINF;
                WINDOW.PINF.document = WINDOW.document;
            }
        }

        exports.loadRenderer = function (uri) {
            return new Promise(function (resolve, reject) {
                exports.PINF.sandbox(uri, resolve, reject);
            });
        }

        makeExports(exports);

        if (!WINDOW) {                
            return null;
        }

        // ############################################################
        // # Browser/DOM Environment
        // ############################################################
    
        exports.markupElement = function (el) {
            return exports.markupNode(el.innerHTML).then(function (htmlCode) {
    
                console.log("htmlCode", htmlCode);
                            
                el.innerHTML = htmlCode;
    
                Array.from(el.querySelectorAll('[_repid]')).forEach(function (el) {
    
                    var rep = exports.getRepForId(el.getAttribute("_repid"));
                    if (
                        rep &&
                        rep.on &&
                        rep.on.mount
                    ) {
                        rep.on.mount(el);
                    }
                });
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

        return exports;
    }

    // Detect environemnt
    const isCommonJS = (typeof exports !== "undefined");
    if (isCommonJS) {
        init(exports);
    } else {
        WINDOW.jsonrep = init({});
    }

})(
    (typeof window !== "undefined") ? window : null
));
