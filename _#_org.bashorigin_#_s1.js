
const LIB = require("bash.origin.lib").forPackage(__dirname).js;

const PATH = LIB.path;
const FS = LIB.FS_EXTRA;
const CODEBLOCK = LIB.CODEBLOCK;
const BO = LIB.BASH_ORIGIN;
const RESOLVE = LIB.RESOLVE;

exports.forConfig = function (CONFIG, options, callback) {

    options = options || {};

    CONFIG.include = CONFIG.include || {};

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

    const bundlers = {};
    const BUNDLER_IDENTITY = __dirname;

    Object.keys(CONFIG.reps).forEach(function (uri) {

        bundlers[uri] = function (callback) {
            try {

                const sourcePaths = [];

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

                    sourcePaths.push(repCodeSrcPath);

                    repCode = FS.readFileSync(repCodeSrcPath, "utf8");

                    if (/(^|\n)PINF\.bundle\(/.test(repCode)) {
                        // Already bundled

                        const cssSrcPath = repCodeSrcPath.replace(/\.js$/, '.css');
                        if (FS.existsSync(cssSrcPath)) {

                            sourcePaths.push(cssSrcPath);

                            return callback(null, {
                                code: repCode,
                                css: FS.readFileSync(cssSrcPath, "utf8"),
                                sourcePaths: sourcePaths
                            });
                        }
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

//console.log("implConfig.basedir:", implConfig.basedir);

                } else {
                    implConfig.code = repCode;
                }

                implConfig.babel = CONFIG.babel || null;

                var implMod = BO.depend("it.pinf.org.browserify#s1", implConfig);
                implMod["#io.pinf/process~s1"]({}, function (err, repCode) {
                    if (err) return callback(err);

                    return callback(null, {
                        code: repCode,
                        css: cssCode,
                        sourcePaths: sourcePaths
                    });
                });

            } catch (err) {
                return callback(err);
            }
        }

        repRoutes["/" + uri + ".rep.js"] = function (options) {

            let watchPathsRegistered = false;

            return function (req, res, next) {
                res.writeHead(200, {
                    "Content-Type": "application/javascript"
                });
                bundlers[uri](function (err, bundleCode) {
                    if (err) return next(err);

                    if (options.registerPathOnChangedHandler && !watchPathsRegistered) {
                        watchPathsRegistered = true;
                        const handler = function () {
                            return new Promise(function (resolve, reject) {
                                bundlers[uri](function (err) {
                                    if (err) return reject(err);
                                    resolve();
                                });
                            });
                        };
                        handler._ID = BUNDLER_IDENTITY;
                        options.registerPathOnChangedHandler(bundleCode.sourcePaths, handler);
                    }

                    res.end(bundleCode.code);                    
                });
            };
        };
        repRoutes["/" + uri + ".rep.css"] = function (options) {

            let watchPathsRegistered = false;

            return function (req, res, next) {
                res.writeHead(200, {
                    "Content-Type": "text/css"
                });
                bundlers[uri](function (err, bundleCode) {
                    if (err) return next(err);

                    if (options.registerPathOnChangedHandler && !watchPathsRegistered) {
                        watchPathsRegistered = true;
                        const handler = function () {
                            return new Promise(function (resolve, reject) {
                                bundlers[uri](function (err) {
                                    if (err) return reject(err);
                                    resolve();
                                });
                            });
                        };
                        handler._ID = BUNDLER_IDENTITY;
                        options.registerPathOnChangedHandler(bundleCode.sourcePaths, handler);
                    }

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
            },
            "babel": CONFIG.babel || null
        }
    };


    const libRoutes = {
        "/lib/jsonrep.js": {
            "@it.pinf.org.browserify#s1": augmentConfig({
                "src": PATH.join(__dirname, "src/jsonrep.js")
            }, "lib/jsonrep.js")
        },
        "/dist/domplate.browser.js": LIB.resolve("domplate/dist/domplate.browser.js"),
        "/dist/insight.domplate.reps/*": PATH.join(LIB.resolve("insight.domplate.reps/package.json"), "../dist/reps"),
        "/dist/insight.rep.js": {
            "@it.pinf.org.browserify#s1": augmentConfig({
                "src": PATH.join(__dirname, "src/insight.rep.js"),
                "format": "pinf"
            }, "dist/insight.rep.js")
        }
    };


    const additionalIncludes = [];

    Object.keys(CONFIG.include).forEach(function (name) {
        const val = CONFIG.include[name];
        if (name === 'riot.js') {
            if (val === true) {
                libRoutes["/dist/riot.js"] = PATH.join(LIB.resolve("riot/package.json"), "../riot.js");
            }
        } else
        if (name === 'riot.min.js') {
            if (val === true) {
                libRoutes["/dist/riot.min.js"] = PATH.join(LIB.resolve("riot/package.json"), "../riot.min.js");
            }
        } else
        if (name === 'riot.csp.js') {    
            if (val === true) {
                libRoutes["/dist/riot.csp.js"] = PATH.join(LIB.resolve("riot/package.json"), "../riot.csp.js");
            }
        } else
        if (name === 'jquery') {    
            if (val === true) {
                libRoutes["/dist/jquery3.min.js"] = PATH.join(__dirname, "dist/jquery3.min.js");
            }
        } else
        if (name === 'regenerator-runtime') {    
            if (val === true) {
                libRoutes["/dist/regenerator-runtime.js"] = {
                    "@it.pinf.org.browserify#s1": augmentConfig({
                        "src": LIB.resolve("regenerator-runtime")
                    }, "dist/regenerator-runtime.js")
                };
            }
        } else {
            if (typeof val !== 'string') {
                throw new Error(`The value for an include directive must be a requireable id!`);
            }

            libRoutes[`/dist/${name}`] = RESOLVE.sync(val, {
                basedir: (CONFIG.basedir) ? CONFIG.basedir : process.cwd()
            });

            additionalIncludes.push(name);
        }
    });

    if (baseDistPath) {
        libRoutes['/dist/'] = baseDistPath;
    }

    const libApp = LIB.BASH_ORIGIN_EXPRESS.hookRoutes(libRoutes, undefined, {
        registerPathOnChangedHandler: options.registerPathOnChangedHandler
    });

    if (CONFIG.dist) {

        if (/\.html?$/.test(CONFIG.dist)) {
            FS.outputFileSync(CONFIG.dist, [
                // TODO: Make base URL format configurable
                '<!DOCTYPE html>',
                '<html lang="en">',
                    '<head>',
                        '<meta charset="utf-8">',
                        ((CONFIG.include['jquery'] === true) ? '<script src="dist/jquery3.min.js"></script>': ''),
                        (
                            (CONFIG.include['riot.csp.js'] === true) ?
                                '<script src="dist/riot.csp.js"></script>' :
                                (
                                    (CONFIG.include['riot.js'] === true) ?
                                        '<script src="dist/riot.js"></script>' :
                                        ((CONFIG.include['riot.min.js'] === true) ?
                                            '<script src="dist/riot.min.js"></script>' :
                                            ''
                                        )
                                )
                        ),
                        ((CONFIG.include['regenerator-runtime'] === true) ? '<script src="dist/regenerator-runtime.js"></script>' : ''),
                        additionalIncludes.map(function (name) {
                            return `<script src="dist/${name}"></script>`;
                        }).join("\n"),
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

    const repsApp = LIB.BASH_ORIGIN_EXPRESS.hookRoutes(repRoutes, undefined, {
        registerPathOnChangedHandler: options.registerPathOnChangedHandler
    });


    const API = {
        "#io.pinf/middleware~s1": function (API) {

            var primed = false;
            function ensurePrimed (callback) {
                if (primed) {
                    return callback(null);
                }
                try {
                    prime().then(function () {
                        callback(null);
                    }, callback);
                } catch (err) {
                    return callback(err);
                }
            }

            var m = null;

            return function (req, res, next) {

                ensurePrimed(function (err) {
                    if (err) return next(err);

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
                                        ((CONFIG.include['jquery'] === true) ? ('<script src="' + (req.mountAt + "/dist/jquery3.min.js").replace(/\/\//g, "/") + '"></script>') : ''),
                                        (
                                            (CONFIG.include['riot.csp.js'] === true) ?
                                                ('<script src="' + (req.mountAt + "/dist/csp.riot.js").replace(/\/\//g, "/") + '"></script>') :
                                                (
                                                    (CONFIG.include['riot.js'] === true) ?
                                                        ('<script src="' + (req.mountAt + "/dist/riot.js").replace(/\/\//g, "/") + '"></script>') :
                                                        (
                                                            (CONFIG.include['riot.min.js'] === true) ?
                                                                ('<script src="' + (req.mountAt + "/dist/riot.min.js").replace(/\/\//g, "/") + '"></script>') :
                                                                ''
                                                        )
                                                )
                                        ),
                                        ((CONFIG.include['regenerator-runtime'] === true) ? ('<script src="' + (req.mountAt + "/dist/regenerator-runtime.js").replace(/\/\//g, "/") + '"></script>') : ''),
                                        additionalIncludes.map(function (name) {
                                            return `<script src="dist/${name}"></script>`;
                                        }).join("\n"),
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
                });
            };
        }
    };

    async function prime () {
        if (
            !baseDistPath ||
            !CONFIG.prime
        ) {
            return;
        }

        Object.keys(CONFIG.include).forEach(function (name) {
            const val = CONFIG.include[name];
            if (name === 'riot.js') {
                if (val === true) {
                    FS.copySync(
                        PATH.join(LIB.resolve("riot/package.json"), "../riot.js"),
                        PATH.join(baseDistPath, "dist/riot.js")
                    );
                }
            } else
            if (name === 'riot.min.js') {
                if (val === true) {
                    FS.copySync(
                        PATH.join(LIB.resolve("riot/package.json"), "../riot.min.js"),
                        PATH.join(baseDistPath, "dist/riot.min.js")
                    );
                }
            } else
            if (name === 'riot.csp.js') {    
                if (val === true) {
                    FS.copySync(
                        PATH.join(LIB.resolve("riot/package.json"), "../riot.csp.js"),
                        PATH.join(baseDistPath, "dist/riot.csp.js")
                    );
                }
            } else
            if (name === 'jquery') {
                if (val === true) {
                    FS.copySync(
                        PATH.join(__dirname, "dist/jquery3.min.js"),
                        PATH.join(baseDistPath, "dist/jquery3.min.js")
                    );
                }
            } else
            if (name === 'regenerator-runtime') {
                // do nothing
            } else {
                if (typeof val !== 'string') {
                    throw new Error(`The value for an include directive must be a requireable id!`);
                }
                FS.copySync(
                    RESOLVE.sync(val, {
                        basedir: (CONFIG.basedir) ? CONFIG.basedir : process.cwd()
                    }),
                    PATH.join(baseDistPath, 'dist', name)
                );
            }
        });
        
        FS.copySync(
            PATH.join(LIB.resolve("insight.domplate.reps/package.json"), "../dist/reps/domplate.browser.js"),
            PATH.join(baseDistPath, "dist/domplate.browser.js")
        );

        FS.copySync(
            PATH.join(LIB.resolve("insight.domplate.reps/package.json"), "../dist/reps"),
            PATH.join(baseDistPath, "dist/insight.domplate.reps")
        );

        return Promise.all(Object.keys(CONFIG.reps).map(function (uri) {
            
            let watchPathsRegistered = false;

            function run () {
                return new Promise(function (resolve, reject) {
                    bundlers[uri](function (err, bundleCode) {
                        if (err) return reject(err);

                        if (options.registerPathOnChangedHandler && !watchPathsRegistered) {
                            watchPathsRegistered = true;
                            const handler = function () {
                                return run();
                            };
                            handler._ID = BUNDLER_IDENTITY;
                            options.registerPathOnChangedHandler(bundleCode.sourcePaths, handler);
                        }

                        FS.outputFileSync(PATH.join(baseDistPath, selfSubpath, uri + ".rep.js"), bundleCode.code, "utf8");
                        if (bundleCode.css) {
                            FS.outputFileSync(PATH.join(baseDistPath, selfSubpath, uri + ".rep.css"), bundleCode.css, "utf8");
                        }
                        resolve();
                    });
                });
            }

            return run();
        }));        
    }

    if (typeof callback !== "undefined") {
        try {
            prime().then(function () {
                callback(null, API);
            }, callback);
        } catch (err) {
            return callback(err);
        }
        return;
    }

    return API;
}
