
const LIB = require("bash.origin.workspace").forPackage(__dirname).LIB;

const PATH = LIB.PATH;
const FS = LIB.FS_EXTRA;
const CODEBLOCK = LIB.CODEBLOCK;
const BO = LIB.BASH_ORIGIN;


exports.forConfig = function (CONFIG) {


    const baseDistPath = CONFIG.dist ? CONFIG.dist.replace(/\.([^\.]+)$/, "") : null;
    // TODO: Make this 'selfSubpath' configurable based on the approach
    //       we are taking to inline dependencies into file structure.
    const selfSubpath = "";

    function augmentConfig (config, targetSubpath) {
        if (baseDistPath) {
            config.dist = PATH.join(baseDistPath, selfSubpath, targetSubpath);
        }
        if (typeof CONFIG.prime !== "undefined") {
            config.prime = CONFIG.prime;
        }
        return config;
    }


    const libApp = LIB.BASH_ORIGIN_EXPRESS.hookRoutes({
        "/lib/jsonrep.js": {
            "@it.pinf.org.browserify#s1": augmentConfig({
                "src": PATH.join(__dirname, "src/jsonrep.js")
            }, "lib/jsonrep.js")
        },
        "/dist/riot.js": PATH.join(__dirname, "src/nodejs/processors/node_modules/riot/riot.js"),
        "/dist/insight.rep.js": {
            "@it.pinf.org.browserify#s1": augmentConfig({
                "src": PATH.join(__dirname, "src/insight.rep.js"),
                "format": "pinf"
            }, "dist/insight.rep.js")
        }
    });

    const repRoutes = {};
    Object.keys(CONFIG.reps).forEach(function (uri) {

        function getBundleCode (callback) {
            try {
                var repCode = CONFIG.reps[uri];
                var repCodeSrcPath = false;
                if (/^\//.test(repCode)) {
                    repCodeSrcPath = repCode;
                    repCode = FS.readFileSync(repCodeSrcPath, "utf8");

                    if (/(^|\n)PINF\.bundle\(/.test(repCode)) {
                        // Already bundled
                        return callback(null, repCode);
                    }

                    repCode = CODEBLOCK.purifyCode(repCode, {
                        freezeToJavaScript: true,
                        on: {
                            codeblock: function (codeblock) {

                                if (codeblock.getFormat() === "riotjs:makeRep") {

                                    var processor = require("./src/nodejs/processors/" + codeblock.getFormat().replace(/:/g, "_") + ".js");

                                    var result = processor.processSync(codeblock);
                                    codeblock._format = "javascript";
                                    codeblock.setCode(result);
                                }
                            }
                        }
                    });

                } else
                if (repCode[".@"] === "github.com~0ink~codeblock/codeblock:Codeblock") {
                    repCode = CODEBLOCK.thawFromJSON(repCode).getCode();
                } else
                if (typeof repCode === "function") {
                    repCode = repCode.toString().replace(/^function \(\) \{\n([\s\S]+)\n\s*\}$/, "$1");
                } else {
                    throw new Error("Unknown code format!");
                }


                // Browserify code.
                var implConfig = {
                    format: "pinf"
                };
                if (repCodeSrcPath) {
                    //FS.outputFileSync(repCodeSrcPath + "~.compiled.js", repCode, "utf8");
                    implConfig.code = repCode;//repCodeSrcPath + "~.compiled.js";
                    implConfig.basedir = PATH.dirname(repCodeSrcPath);
                } else {
                    implConfig.code = repCode;
                }
                var implMod = BO.depend("it.pinf.org.browserify#s1", implConfig);
                implMod["#io.pinf/process~s1"]({}, function (err, repCode) {
                    if (err) return callback(err);

                    return callback(null, repCode);
                });

            } catch (err) {
                return callback(err);
            }
        }

        if (
            baseDistPath &&
            CONFIG.prime
        ) {
            getBundleCode(function (err, bundleCode) {
                if (err) return console.error(err);

                FS.outputFileSync(PATH.join(baseDistPath, selfSubpath, uri + ".rep.js"), bundleCode, "utf8");

                FS.copySync(
                    PATH.join(__dirname, "src/nodejs/processors/node_modules/riot/riot.min.js"),
                    PATH.join(baseDistPath, "dist/riot.js")
                );
            });
        }

        repRoutes["/" + uri + ".rep.js"] = function () {
            
            return function (req, res, next) {
                res.writeHead(200, {
                    "Content-Type": "application/javascript"
                });
                getBundleCode(function (err, bundleCode) {
                    if (err) return next(err);

                    res.end(bundleCode);                    
                });
            };
        };
    });

    // NOTE: We use 'repRoutes' just to make file generation easier.
    repRoutes["/page.js"] = {
        "@it.pinf.org.browserify#s1": {
            "src": PATH.join(__dirname, "src/page.js"),
            "format": "pinf",
            "variables": {
                "DOCUMENT": CONFIG.page
            }
        }
    };

    if (CONFIG.dist) {

        if (/\.html?$/.test(CONFIG.dist)) {
            FS.outputFileSync(CONFIG.dist, [
                // TODO: Make base URL format configurable
                '<head>',
                    '<script>',
                        'var baseUrl = window.location.pathname.replace(/\.[^\.]+$/, "");',
                        'var pmodule = { "filename": (baseUrl + "/") };',
                        'var script = document.createElement("script");',
                        'script.type = "text/javascript";',
                        'script.src = baseUrl + "/dist/riot.js";',
                        'document.getElementsByTagName("head")[0].appendChild(script);',
                        'script = document.createElement("script");',
                        'script.type = "text/javascript";',
                        'script.src = baseUrl + "/lib/jsonrep.js";',
                        'document.getElementsByTagName("head")[0].appendChild(script);',
                    '</script>',
                    '<style>',
                        'HTML, BODY {',
                            'padding: 0px;',
                            'margin: 0px;',
                        '}',
                    '</style>',
                '</head>',
                '<body renderer="jsonrep" style="visibility:hidden;">' + JSON.stringify(CONFIG.page) + '</body>'
            ].join("\n"), "utf8");
        } else
        if (/\.js?$/.test(CONFIG.dist)) {
            repRoutes["/page.js"]["@it.pinf.org.browserify#s1"].dist = CONFIG.dist;
            repRoutes["/page.js"]["@it.pinf.org.browserify#s1"].prime = CONFIG.prime || false;
        } else {
            throw new Error("Unknown 'dist': " + CONFIG.dist);
        }
    }

    const repsApp = LIB.BASH_ORIGIN_EXPRESS.hookRoutes(repRoutes);


    return {
        "#io.pinf/middleware~s1": function (API) {

            var m = null;

            return function (req, res, next) {

                // TODO: Use standard route conventions for these.
                if (req.method === "GET") {
                    if (
                        /^\/lib\//.test(req.url) ||
                        /^\/dist\//.test(req.url)
                    ) {
                        libApp(req, res, next);
                        return;
                    } else
                    if ((m = req.url.match(/^\/(.+)\.rep\.js$/))) {
                        if (CONFIG.reps[m[1]]) {
                            repsApp(req, res, next);
                            return;
                        } else {
                            return next(new Error("Rep with name '" + m[1] + "' not declared!"));
                        }
                    } else
                    if (
                        (
                            /^\/$/.test(req.url) ||
                            /^\/\.html$/.test(req.url)
                        ) &&
                        CONFIG.page
                    ) {
                        if (CONFIG.rootFormat === "pinf") {
                            throw new Error("Implement PINF bundle for root page!");
                        }
                        res.writeHead(200, {
                            "Content-Type": "text/html"
                        });
                        res.end([
                            // TODO: Make base URL format configurable
                            '<head>',
                                '<script src="' + (req.mountAt + "/dist/riot.js").replace(/\/\//g, "/") + '"></script>',
                                '<script src="' + (req.mountAt + "/lib/jsonrep.js").replace(/\/\//g, "/") + '"></script>',
                                '<script>var pmodule = { "filename": "' + (req.mountAt + req.url).replace(/\/\//g, "/") + '" };</script>',
                                '<style>',
                                    'HTML, BODY {',
                                        'padding: 0px;',
                                        'margin: 0px;',
                                    '}',
                                '</style>',
                            '</head>',
                            '<body renderer="jsonrep" style="visibility:hidden;">' + JSON.stringify(CONFIG.page) + '</body>'
                        ].join("\n"));
                        return;
                    } else
                    if (
                        /^\/\.js$/.test(req.url) &&
                        CONFIG.page
                    ) {
                        req.url = "/page.js";

                        repsApp(req, res, function (err) {
                            if (err) {
                                err.message += " (for url '" + req.url + "')";
                                err.stack += "\n(for url '" + req.url + "')";
                            }
                            return next(err);
                        });
                        return;
                    }
                }
                return next();
            };
        }
    }
}
