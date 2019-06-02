
const LIB = require("bash.origin.lib").forPackage(__dirname).js;

const PATH = LIB.path;
const FS = LIB.FS_EXTRA;
const CODEBLOCK = LIB.CODEBLOCK;
const BO = LIB.BASH_ORIGIN;


exports.forConfig = function (CONFIG) {


    const baseDistPath = CONFIG.dist ? CONFIG.dist.replace(/([^\/]+)\.([^\.]+)$/, "") : null;
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

    const repRoutes = {};

    Object.keys(CONFIG.reps).forEach(function (uri) {

        function getBundleCode (callback) {
            try {
                var repCode = CONFIG.reps[uri];
                var repCodeSrcPath = false;

                if (/^\//.test(repCode)) {
                    // All good
                } else
                if (/^\./.test(repCode)) {
                    repCode = PATH.join((CONFIG.basedir) ? CONFIG.basedir : process.cwd(), repCode);
                } else
                if (typeof repCode === 'string') {

                    var originalRepCode = repCode;
                    var resolvedPath = null;
                    var searchPath = repCode;
                    if (/\//.test(searchPath)) {
                        searchPath = searchPath.split("/")[0] + "/package.json";                        
                    }

                    if (CONFIG.baseDir) {
                        try {
                            resolvedPath = LIB.RESOLVE.sync(searchPath, {
                                basedir: CONFIG.baseDir
                            });
                        } catch (err) {
                        }
                    }
                    if (!resolvedPath) {
                        resolvedPath = LIB.RESOLVE.sync(searchPath, {
                            basedir: __dirname
                        });
                    }

                    if (searchPath !== repCode) {
                        repCode = PATH.join(
                            resolvedPath,
                            "..",
                            repCode.replace(/^[^\/]+\/?/, '')
                        );
                    } else {
                        repCode = resolvedPath;
                    }

                    if (!/^\//.test(repCode)) {
                        return callback(new Error(`Could not resolve rep code uri '${originalRepCode}'!`));
                    }
                }

                var cssCode = undefined;
                if (/^\//.test(repCode)) {
                    repCodeSrcPath = repCode;
                    repCode = FS.readFileSync(repCodeSrcPath, "utf8");

                    if (/(^|\n)PINF\.bundle\(/.test(repCode)) {
                        // Already bundled
                        return callback(null, {
                            code: repCode
                        });
                    }

                    var repId = LIB.CRYPTO.createHash('sha1').update(repCode).digest('hex');

                    repCode = CODEBLOCK.purifyCode(repCode, {
                        freezeToJavaScript: true,
                        on: {
                            codeblock: function (codeblock) {

                                if (codeblock.getFormat() === "css") {
                                    if (CONFIG.externalizeCss) {

                                        cssCode = codeblock.getCode();

                                        if (cssCode) {

                                            // TODO: Optionally warn if no ':scope' keywords are found to remind user to scope css.
                                            cssCode = cssCode.replace(/:scope/g, '[_cssid="' + repId + '"]');

                                            codeblock._format = "json";

                                            codeblock.setCode(JSON.stringify({
                                                _cssid: repId,
                                                repUri: uri
                                            }));
                                        }
                                    }
                                } else
                                if (codeblock.getFormat() === "riotjs:makeRep") {

                                    var processor = require("./src/nodejs/processors/" + codeblock.getFormat().replace(/:/g, "_") + ".js");

                                    var result = processor.processSync(codeblock, {
                                        uri: uri,
                                        CONFIG: CONFIG
                                    });
                                    codeblock._format = "javascript";
                                    codeblock.setCode(result.code);

                                    if (result.css) {
                                        cssCode = result.css;
                                    }
                                }
                            }
                        }
                    }).toString();
                } else
                if (repCode[".@"] === "github.com~0ink~codeblock/codeblock:Codeblock") {
                    repCode = CODEBLOCK.thawFromJSON(repCode).getCode();
                } else
                if (typeof repCode === "function") {
                    repCode = repCode.toString().replace(/^function \(\) \{\n([\s\S]+)\n\s*\}$/, "$1");
                } else {
                    console.error("CONFIG.reps[uri]", CONFIG.reps[uri]);
                    console.error("repCode", repCode);
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

                    return callback(null, {
                        code: repCode,
                        css: cssCode
                    });
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

                FS.outputFileSync(PATH.join(baseDistPath, selfSubpath, uri + ".rep.js"), bundleCode.code, "utf8");
                if (bundleCode.css) {
                    FS.outputFileSync(PATH.join(baseDistPath, selfSubpath, uri + ".rep.css"), bundleCode.css, "utf8");
                }

                FS.copySync(
                    PATH.join(LIB.resolve("riot/package.json"), "../riot.js"),
                    PATH.join(baseDistPath, "dist/riot.js")
                );

                FS.copySync(
                    PATH.join(LIB.resolve("riot/package.json"), "../riot.csp.js"),
                    PATH.join(baseDistPath, "dist/riot.csp.js")
                );

                FS.copySync(
                    PATH.join(__dirname, "dist/jquery3.min.js"),
                    PATH.join(baseDistPath, "dist/jquery3.min.js")
                );

                FS.copySync(
                    PATH.join(LIB.resolve("insight.domplate.reps/package.json"), "../dist/reps/domplate.browser.js"),
                    PATH.join(baseDistPath, "dist/domplate.browser.js")
                );

                FS.copySync(
                    PATH.join(LIB.resolve("insight.domplate.reps/package.json"), "../dist/reps"),
                    PATH.join(baseDistPath, "dist/insight.domplate.reps")
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

                    res.end(bundleCode.code);                    
                });
            };
        };
        repRoutes["/" + uri + ".rep.css"] = function () {

            return function (req, res, next) {
                res.writeHead(200, {
                    "Content-Type": "text/css"
                });
                getBundleCode(function (err, bundleCode) {
                    if (err) return next(err);

                    res.end(bundleCode.css);                    
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


    const libRoutes = {
        "/lib/jsonrep.js": {
            "@it.pinf.org.browserify#s1": augmentConfig({
                "src": PATH.join(__dirname, "src/jsonrep.js")
            }, "lib/jsonrep.js")
        },
        "/dist/riot.js": PATH.join(LIB.resolve("riot/package.json"), "../riot.js"),
        "/dist/riot.csp.js": PATH.join(LIB.resolve("riot/package.json"), "../riot.csp.js"),
        "/dist/jquery3.min.js": PATH.join(__dirname, "dist/jquery3.min.js"),
        "/dist/domplate.browser.js": LIB.resolve("domplate/dist/domplate.browser.js"),
        "/dist/insight.domplate.reps/*": PATH.join(LIB.resolve("insight.domplate.reps/package.json"), "../dist/reps"),
        "/dist/regenerator-runtime.js": {
            "@it.pinf.org.browserify#s1": augmentConfig({
                "src": LIB.resolve("regenerator-runtime")
            }, "dist/regenerator-runtime.js")
        },
        "/dist/insight.rep.js": {
            "@it.pinf.org.browserify#s1": augmentConfig({
                "src": PATH.join(__dirname, "src/insight.rep.js"),
                "format": "pinf"
            }, "dist/insight.rep.js")
        }
    };

    if (baseDistPath) {
        libRoutes['/dist/'] = baseDistPath;
    }

    const libApp = LIB.BASH_ORIGIN_EXPRESS.hookRoutes(libRoutes);


    if (CONFIG.dist) {

        if (/\.html?$/.test(CONFIG.dist)) {
            FS.outputFileSync(CONFIG.dist, [
                // TODO: Make base URL format configurable
                '<!DOCTYPE html>',
                '<html lang="en">',
                    '<head>',
                        '<meta charset="utf-8">',
                        '<script src="dist/jquery3.min.js"></script>',
                        '<script src="dist/riot.js"></script>',
                        '<script src="dist/regenerator-runtime.js"></script>',
                        '<script src="lib/jsonrep.js"></script>',

/*
                        '<script>',
                            'var baseUrl = window.location.pathname.replace(/\.[^\.]+$/, "");',
                            //'var pmodule = { "filename": (baseUrl + "/") };',

                            'var script = document.createElement("script");',
                            'script.type = "text/javascript";',
                            'script.src = baseUrl + "/dist/jquery3.min.js";',
                            'document.getElementsByTagName("head")[0].appendChild(script);',

                            'script = document.createElement("script");',
                            'script.type = "text/javascript";',
                            'script.src = baseUrl + "/dist/riot.js";',
                            'document.getElementsByTagName("head")[0].appendChild(script);',

                            'script = document.createElement("script");',
                            'script.type = "text/javascript";',
                            'script.src = baseUrl + "/dist/regenerator-runtime.js";',
                            'document.getElementsByTagName("head")[0].appendChild(script);',

                            'script = document.createElement("script");',
                            'script.type = "text/javascript";',
                            'script.src = baseUrl + "/lib/jsonrep.js";',
                            'document.getElementsByTagName("head")[0].appendChild(script);',
                        '</script>',
*/
                        /*
                        '<style>',
                            'HTML, BODY {',
                                'padding: 0px;',
                                'margin: 0px;',
                            '}',
                        '</style>',
                        */
                    '</head>',
                    '<body renderer="jsonrep" style="visibility:hidden;">' + JSON.stringify(CONFIG.page) + '</body>',
                '</html>'
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
                    if ((m = req.url.match(/^\/(.+)\.rep\.(js|css)$/))) {
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
                            '<!DOCTYPE html>',
                            '<html lang="en">',
                                '<head>',
                                    '<meta charset="utf-8">',
                                    '<script src="' + (req.mountAt + "/dist/jquery3.min.js").replace(/\/\//g, "/") + '"></script>',
                                    '<script src="' + (req.mountAt + "/dist/riot.js").replace(/\/\//g, "/") + '"></script>',
                                    '<script src="' + (req.mountAt + "/dist/regenerator-runtime.js").replace(/\/\//g, "/") + '"></script>',
                                    '<script src="' + (req.mountAt + "/lib/jsonrep.js").replace(/\/\//g, "/") + '"></script>',
                                    /*
                                    '<script>var pmodule = { "filename": "' + (req.mountAt + req.url).replace(/\/\//g, "/") + '" };</script>',
                                    '<style>',
                                        'HTML, BODY {',
                                            'padding: 0px;',
                                            'margin: 0px;',
                                        '}',
                                    '</style>',
                                    */
                                '</head>',
                                '<body renderer="jsonrep" style="visibility:hidden;">' + JSON.stringify(CONFIG.page) + '</body>',
                            '</html>',
                        ].join("\n"));
                        return;
                    } else
                    if (
                        /^\/(page)?\.js$/.test(req.url) &&
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
