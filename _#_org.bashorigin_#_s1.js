
const PATH = require("path");


exports.forConfig = function (CONFIG) {

    return {
        "#io.pinf/middleware~s1": function (API) {

            const libApp = require('bash.origin.express').hookRoutes({
                "/lib/jsonrep.js": {
                    "@it.pinf.org.browserify#s1": {
                        "src": PATH.join(__dirname, "src/jsonrep.js")
                    }
                },
                "/dist/insight.rep.js": {
                    "@it.pinf.org.browserify#s1": {
                        "src": PATH.join(__dirname, "src/insight.rep.js"),
                        "dist": PATH.join(__dirname, "dist/insight.rep.js"),
                        "format": "pinf"
                    }
                }
            });

            const repRoutes = {};
            Object.keys(CONFIG.reps).forEach(function (uri) {                
                repRoutes["/" + uri + ".rep.js"] = function (req, res, next) {
                    res.writeHead(200, {
                        "Content-Type": "application/javascript"
                    });
                    res.end([
                        'PINF.bundle("", function(require) {',
                            'require.memoize("/main.js", function(require, exports, module) {',
                            CONFIG.reps[uri].toString().replace(/^function \(\) \{\n([\s\S]+)\n\s*\}$/, "$1"),
                            '});',
                        '});'
                    ].join("\n"));                                        
                }
            });
            const repsApp = require('bash.origin.express').hookRoutes(repRoutes);

            var m = null;

            return function (req, res, next) {

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
                        /^\/$/.test(req.url) &&
                        CONFIG.page
                    ) {
                        res.writeHead(200, {
                            "Content-Type": "text/html"
                        });
                        res.end([
                            // TODO: Make base URL format configurable
                            '<head><script src="' + req.mountAt + '/.lib/lib/jsonrep.js"></script></head>',
                            '<body renderer="jsonrep">' + JSON.stringify(CONFIG.page) + '</body>'
                        ].join("\n"));
                        return;
                    }
                }
                return next();
            };
        }
    }
}
