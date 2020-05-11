
function makeExports (exports) {

    var reps = {};
    var repIndex = 0;

    exports.getRepForId = function (id) {
        return reps[id] || null;
    }

    exports.makeRep = function (html, rep, options) {
        if (
            typeof html === "object" &&
            typeof html.html !== "undefined" &&
            typeof rep === "undefined"
        ) {
            rep = html;
            html = rep.html;
            delete rep.html;
        } else
        if (
            typeof html === "object" &&
            typeof html.code !== "undefined" &&
            //typeof html.code.html !== "undefined" &&
            typeof rep === "undefined"
        ) {
            // TODO: Replace variables
            rep = html.code;
            if (typeof rep === "function") {
                rep = rep.call(exports, html, options);
            }
            html = rep.html;
            delete rep.html;
        }
        return exports._makeRep(html, rep);
    } 

    exports.makeRep2 = function (html, options) {
        var rep = undefined;
        if (
            typeof html === "object" &&
            typeof html.html !== "undefined"
        ) {
            rep = html;
            html = rep.html;
            delete rep.html;
        } else
        if (
            typeof html === "object" &&
            typeof html.code !== "undefined"
            //typeof html.code.html !== "undefined" &&
        ) {
            // TODO: Replace variables
            rep = html.code;
            if (typeof rep === "function") {
                rep = rep.call(exports, html, options);
            }
            html = rep.html;
            delete rep.html;
        }
        return exports._makeRep(html, rep);
    } 

    exports._makeRep = function (html, rep) {
        // TODO: Speed this up.
        if (
            typeof html === "object" &&
            html[".@"] === "github.com~0ink~codeblock/codeblock:Codeblock"
        ) {
            html = exports.Codeblock.FromJSON(html).compile(rep).getCode().replace(/^\n|\n$/g, "");
        }

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

        if (
            typeof node === "string" &&
            /^\{/.test(node)
        ) {
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
            uri = "/../" + keys[0].replace(/^@/, "") + ".rep";
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
                uri = "/reps/insight.rep.js";
            }
        }

        // if (
        //     !/^[\.\/]/.test(uri) &&
        //     exports.options.ourBaseUri
        // ) {
        //     uri = exports.options.ourBaseUri + "/" + uri;
        // }

        return exports.loadRenderer(uri).then(function (renderer) {

            return renderer.main(exports, node, {
                renderer: {
                    uri: uri
                }
            });
        });
    }
}

((function (WINDOW) {

    function init (exports) {

        exports.options = exports.options || {};

        exports.Codeblock = require("codeblock/codeblock.rt0").Codeblock;

        if (WINDOW) {

            // TODO: Only re-inject loader if not already present (build two versions of JS file).
            if (typeof WINDOW.PINF === "undefined") {
                WINDOW.PINF = exports.PINF = require("pinf-loader-js").Loader(WINDOW);
            } else {
                // TODO: Instead of re-using loader here allow attachment
                //       of a sub loader to the parent loader?
                exports.PINF = WINDOW.PINF;
            }

            // if (
            //     !exports.options.ourBaseUri &&
            //     typeof WINDOW.bundle !== "undefined"
            // ) {
            //     exports.options.ourBaseUri = WINDOW.bundle.replace(/\/[^\/]+$/, '');
            // }

        }

        exports.getBaseUri = function () {

            // console.log("WINDOW.pmodule::", WINDOW.pmodule);
            // console.log("exports.options.ourBaseUri::", exports.options.ourBaseUri);

            // TODO: Only use this approach in the legacy browser build.
            if (
                !exports.options.ourBaseUri &&
                typeof WINDOW.document !== "undefined"
            ) {

                //if (!exports.PINF.document) {
                //    exports.PINF.document = WINDOW.document;
                //}

                if (!exports.options.ourBaseUri) {
                    var ourBaseUri = Array.from(WINDOW.document.querySelectorAll('SCRIPT[src]')).filter(function (tag) {
                        return /\/jsonrep(\.min)?\.js$/.test(tag.getAttribute("src"));
                    });
                    if (ourBaseUri.length) {
                        exports.options.ourBaseUri = ourBaseUri[0].getAttribute("src").replace(/\/[^\/]+$/, '');
                    }
                }
            }            

            if (!exports.options.ourBaseUri) {
                throw new Error(`[jsonrep] Could not determine 'ourBaseUri' by looking at 'options' and injected script tags!`);
            }
            return exports.options.ourBaseUri;
        }

        exports.loadStyle = function (uri) {

//console.log("[jsonrep] uri:", uri);
//console.log("[jsonrep] WINDOW.pmodule:", WINDOW.pmodule);

            // Adjust base path depending on the environment.
            // if (
            //     WINDOW &&
            //     typeof WINDOW.pmodule !== "undefined" &&
            //     !/^\//.test(uri)
            // ) {
            //     uri = [
            //         WINDOW.pmodule.filename.replace(/\/([^\/]*)\/([^\/]*)$/, ""),
            //         uri
            //     ].join("/").replace(/\/\.?\//g, "/");
            // }

//console.log("loadStyle", uri, exports.getBaseUri());

            uri = `${exports.getBaseUri()}/${uri}`.replace(/\/\.?\//g, '/');

//console.log("loadStyle from url:", uri);

            return new Promise(function (resolve, reject) {
// TODO: Only log when in debug mode.
//console.log("[jsonrep] Load style:", uri);
                var link = window.document.createElementNS ?
                            window.document.createElementNS("http://www.w3.org/1999/xhtml", "link") :
                            window.document.createElement("link");
                link.rel = "stylesheet";
                link.href = uri;
                link.onload = function () {
                    resolve();
                }
                var head = window.document.getElementsByTagName("head")[0] || window.document.documentElement;
                head.appendChild(link);
            });
        }

        exports.loadRenderer = function (uri) {

            // Adjust base path depending on the environment.
            // if (
            //     WINDOW &&
            //     typeof WINDOW.pmodule !== "undefined" &&
            //     !/^\//.test(uri)
            // ) {
            //     uri = [
            //         WINDOW.pmodule.filename.replace(/\/([^\/]*)\/([^\/]*)$/, ""),
            //         uri
            //     ].join("/").replace(/\/\.?\//g, "/");
            // }

//console.log("loadRenderer", uri, exports.getBaseUri());

            uri = `${exports.getBaseUri()}/${uri}`.replace(/\/\.?\//g, '/');

//console.log("loadRenderer", uri, exports.getBaseUri());

            return new Promise(function (resolve, reject) {

// TODO: Only log when in debug mode.
//console.log("Load rep:", uri);

                exports.PINF.sandbox(uri, resolve, reject);
            });
        }

        makeExports(exports);

        if (!WINDOW || !WINDOW.document) {                
            return exports;
        }

        // ############################################################
        // # Browser/DOM Environment
        // ############################################################

        exports.mountElement = function (el) {

            var allCss = [];
            Array.from(el.querySelectorAll('[_repid]')).forEach(function (el) {

                var rep = exports.getRepForId(el.getAttribute("_repid"));

                if (rep.css) {

                    var css = null;
                    if (typeof rep.css === 'string') {
                        css = rep.css;
                    } else {
                        var block = exports.Codeblock.FromJSON(rep.css);
                        if (block._format === 'json') {
                            var cssConfig = JSON.parse(block.getCode());

                            el.setAttribute("_cssid", cssConfig._cssid);
                            exports.loadStyle('../' + cssConfig.repUri + '.rep.css');

                        } else
                        if (block._format === 'css') {
                            css = block.getCode();
                        }
                    }

                    if (css && css.length) {
                        // TODO: Optionally warn if no ':scope' keywords are found to remind user to scope css.
                        css = css.replace(/:scope/g, '[_repid="' + el.getAttribute("_repid") + '"]');

                        allCss.push(css);
                    }
                }

                if (
                    rep &&
                    rep.on &&
                    rep.on.mount
                ) {
                    rep.on.mount(el);
                }
            });

            if (allCss.length > 0) {
                var style = WINDOW.document.createElement('style');
                style.innerHTML = allCss.join("\n");
// TODO: Only log when in debug mode.
//console.log("Inject <style>:", style.innerHTML);
                WINDOW.document.body.appendChild(style);
            }

            el.style.visibility = "unset";                
        }
            
        exports.markupElement = function (el) {

            return exports.markupNode(el.innerHTML).then(function (htmlCode) {

                el.innerHTML = htmlCode;

                exports.mountElement(el);

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

        if (
            !WINDOW.jsonrep_options ||
            WINDOW.jsonrep_options.markupDocument !== false
        ) {
            if (WINDOW.document.readyState === "loading") {
                if (typeof WINDOW.addEventListener !== "undefined") {
                    WINDOW.addEventListener("DOMContentLoaded", markupDocument, false);
                } else {
                    WINDOW.attachEvent("onload", markupDocument);
                }
            } else {
                setTimeout(markupDocument, 0);
            }
        }

        return exports;
    }

    // Detect environemnt
    if (typeof sandbox !== "undefined") {
        init(sandbox);

    // TODO: Set global only for the legacy (leaky) browser format.
    // } else
    // if (WINDOW) {
    //     WINDOW.jsonrep = init({});

    } else
    if (typeof exports !== "undefined") {
        init(exports);
    } else {
        throw new Error("Cannot detect environment!");
    }

})(
    (typeof window !== "undefined") ? window : null
));
