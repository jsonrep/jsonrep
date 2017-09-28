
const PATH = require("path");
const FS = require("fs-extra");
const CODEBLOCK = require("codeblock");


exports.forConfig = function (CONFIG) {

    const SELF_ID = "jsonrep";

console.log("CONFIG", CONFIG);    

    const baseDistPath = CONFIG.dist ? CONFIG.dist.replace(/\.([^\.]+)$/, "") : null;
    // TODO: Make this 'selfSubpath' configurable based on the approach
    //       we are taking to inline dependencies into file structure.
    const selfSubpath = ".lib";

console.log("baseDistPath", baseDistPath);
    function augmentConfig (config, targetSubpath) {
        if (baseDistPath) {
            config.dist = PATH.join(baseDistPath, selfSubpath, targetSubpath);
        }
        if (typeof CONFIG.prime !== "undefined") {
            config.prime = CONFIG.prime;
        }
console.log("augmented config", config);        
        return config;
    }


    const libApp = require('bash.origin.express').hookRoutes({
        "/lib/jsonrep.js": {
            "@it.pinf.org.browserify#s1": augmentConfig({
                "src": PATH.join(__dirname, "src/jsonrep.js")
            }, "lib/jsonrep.js")
        },
        "/dist/insight.rep.js": {
            "@it.pinf.org.browserify#s1": augmentConfig({
                "src": PATH.join(__dirname, "src/insight.rep.js"),
                "format": "pinf"
            }, "dist/insight.rep.js")
        }
    });

    const repRoutes = {};
    Object.keys(CONFIG.reps).forEach(function (uri) {

        var repCode = CONFIG.reps[uri];
        if (repCode[".@"] === "github.com~0ink~codeblock/codeblock:Codeblock") {
            repCode = CODEBLOCK.thawFromJSON(repCode).getCode();
        } else
        if (typeof repCode === "function") {
            repCode = repCode.toString().replace(/^function \(\) \{\n([\s\S]+)\n\s*\}$/, "$1");
        } else {
            throw new Error("Unknown code format!");
        }

        var bundleCode = [
            'PINF.bundle("", function(require) {',
                'require.memoize("/main.js", function(require, exports, module) {',
                repCode,
                '});',
            '});'
        ].join("\n");

        if (
            baseDistPath &&
            CONFIG.prime
        ) {
            FS.outputFileSync(PATH.join(baseDistPath, selfSubpath, uri + ".rep.js"), bundleCode, "utf8");
        }

        repRoutes["/" + uri + ".rep.js"] = function (req, res, next) {
            res.writeHead(200, {
                "Content-Type": "application/javascript"
            });
            res.end(bundleCode);                                        
        }
    });

    // NOTE: We use 'repRoutes' just to make file generation easier.
    repRoutes["/page.js"] = {
        "@it.pinf.org.browserify#s1": {
            "src": PATH.join(__dirname, "src/page.js"),
            "dist": (CONFIG.dist) ? CONFIG.dist : undefined,
            "format": "pinf",
            "prime": CONFIG.prime || false,
            "variables": {
                "DOCUMENT": CONFIG.page
            }
        }
    };

    const repsApp = require('bash.origin.express').hookRoutes(repRoutes);


    return {
        "#io.pinf/middleware~s1": function (API) {

            var m = null;

            return function (req, res, next) {

                // TODO: Use standard route conventions for these.
                if (req.method === "GET") {
                    if ((m = req.url.match(/^\/(.+)\.rep\.js$/))) {
                        if (CONFIG.reps[m[1]]) {
                            repsApp(req, res, next);
                            return;
                        } else {
                            return next(new Error("Rep with name '" + m[1] + "' not declared!"));
                        }
                    } else
                    if (/^\/\.lib\//.test(req.url)) {
                        req.url = req.url.replace(/^\/\.lib/, "");                                            
                        libApp(req, res, next);
                        return;
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
                                '<script src="' + req.mountAt + '/.lib/lib/jsonrep.js"></script>',
                                '<script>var pmodule = { "filename": "' + req.mountAt + req.url + '" };</script>',
                            '</head>',
                            '<body renderer="jsonrep">' + JSON.stringify(CONFIG.page) + '</body>'
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
