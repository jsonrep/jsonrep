
const LIB = require("bash.origin.lib").js;

const PATH = LIB.path;
let FS = LIB.FS_EXTRA;
const CODEBLOCK = LIB.CODEBLOCK;
const BO = LIB.BASH_ORIGIN;
const RESOLVE = LIB.RESOLVE;

exports.forConfig = async function (CONFIG, options) {
    options = options || {};

    if (options.LIB) {
        FS = options.LIB.FS;
        LIB.FS = FS;
        LIB.FS_EXTRA = FS;
    }

    if (!CONFIG.dist) {
        throw new Error(`[jsonrep] 'dist' not set!`);
    }
    if (/\.(html?|js)$/.test(CONFIG.dist)) {
        throw new Error(`[jsonrep] 'dist' property may not include a filename!`);
    }
    if (CONFIG.baseDir) {
        throw new Error(`[jsonrep] Use 'basedir', not 'baseDir'!`);
    }
    if (arguments[2]) {
        throw new Error(`[jsonrep] Use of 'callback' is DEPRECATED!`);
    }

    CONFIG.include = CONFIG.include || {};
    CONFIG.basedir = CONFIG.basedir || process.cwd();

//console.error("[jsonrep] CONFIG:", CONFIG);

    let baseDistPath = PATH.resolve(CONFIG.basedir, CONFIG.dist);


    const bundlers = {};
    const BUNDLER_IDENTITY = __dirname;

//console.error("baseDistPath:", baseDistPath);

    if (CONFIG.reps) {

        await Promise.all(Object.keys(CONFIG.reps).map(async function (uri) {

            const sourcePaths = [];

            let repCode = CONFIG.reps[uri];
            let repCodeSrcPath = false;

            if (/^\//.test(repCode)) {
                // All good
            } else
            if (/^\./.test(repCode)) {

// console.log('join rep CODE::1:', options.workspace, options.home, options.target, options.build, options.result);
// console.log('join rep CODE::2:', CONFIG.basedir, repCode);

                repCode = PATH.join(CONFIG.basedir, repCode);
            } else
            if (typeof repCode === 'string') {

                let originalRepCode = repCode;
                let resolvedPath = null;
                let searchPath = repCode;
                if (/\//.test(searchPath)) {
                    searchPath = searchPath.split("/")[0] + "/package.json";                        
                }

                if (CONFIG.basedir) {
                    try {
                        resolvedPath = LIB.RESOLVE.sync(searchPath, {
                            basedir: CONFIG.basedir
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
                    throw new Error(`Could not resolve rep code uri '${originalRepCode}'!`);
                }
            }

            let cssCode = undefined;
            if (/^\//.test(repCode)) {
                repCodeSrcPath = repCode;

                sourcePaths.push(repCodeSrcPath);

                options.result.inputPaths[repCodeSrcPath] = true;

                repCode = await FS.readFile(repCodeSrcPath, "utf8");

                if (/(^|\n)PINF\.bundle\(/.test(repCode)) {
                    // Already bundled

                    const cssSrcPath = repCodeSrcPath.replace(/\.js$/, '.css');
                    if (await FS.exists(cssSrcPath)) {

                        sourcePaths.push(cssSrcPath);

                        options.result.inputPaths[cssSrcPath] = true;

                        return;
                        // return callback(null, {
                        //     code: repCode,
                        //     css: await FS.readFile(cssSrcPath, "utf8"),
                        //     sourcePaths: sourcePaths
                        // });
                    }
                    return {
                        code: repCode
                    };
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

                                var processor = require("../../src/nodejs/processors/" + codeblock.getFormat().replace(/:/g, "_") + ".js");

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

//console.error("BUNDLE FOR repCode::", repCode);

            // Browserify code.
            let implConfig = {
                format: "pinf"
            };
            if (repCodeSrcPath) {
                implConfig.code = repCode;
                implConfig.basedir = PATH.dirname(repCodeSrcPath);
            } else {
                implConfig.code = repCode;
                // The caller must always specify from where relative paths should be
                // resolved. i.e. the 'basedir'.
                implConfig.basedir = CONFIG.basedir || options.workspace.path;
            }
            implConfig.babel = CONFIG.babel || null;

            // Instruct 'gi0.PINF.it/build/v0' to track these paths as 'inputPaths' for all build results.
            implConfig.prependInputPaths = sourcePaths;

// console.log("implConfig:::", implConfig);

            const repCodePath = await LIB['@pinf-it/core']({
                cwd: options.workspace.path,
                verbose: options.LIB.verbose
            }).runToolForModel(
                'gi0.PINF.it/build/v0',
                `/${LIB.PATH.relative(options.workspace.path, options.target.path)}`.replace(/\/\//g, '/'),
                `/${uri}.rep.js`,
                'it.pinf.org.browserify # build/v1', implConfig,
                [
                    'onBuild:path'
                ]
            );
            options.result.outputPaths[repCodePath] = true;

            repCode = await LIB.FS_EXTRA.readFile(repCodePath, 'utf8');

//console.error("DONE repCode::", repCode);

            if (cssCode) {
                const cssPath = repCodePath.replace(/\.js$/, '.css');
                options.result.outputPaths[cssPath] = true;
                await FS.outputFile(cssPath, cssCode, "utf8");
            }

            // return {
            //     code: repCode,
            //     css: cssCode,
            //     sourcePaths: sourcePaths
            // };
        }));

// let watchPathsRegistered = false;

//         await Promise.all(Object.keys(CONFIG.reps).map(async function (uri) {

//             const bundleCode = await bundlers[uri]();

// //            options.result.outputPaths[PATH.join(baseDistPath, uri + ".rep.js")] = true;
// //            await FS.outputFile(PATH.join(baseDistPath, uri + ".rep.js"), bundleCode.code, "utf8");
//             // if (bundleCode.css) {
//             //     options.result.outputPaths[PATH.join(baseDistPath, uri + ".rep.css")] = true;
//             //     await FS.outputFile(PATH.join(baseDistPath, uri + ".rep.css"), bundleCode.css, "utf8");
//             // }
//         }));

    }

    const additionalIncludes = [];

    if (CONFIG.include) {
        await Promise.all(Object.keys(CONFIG.include).map(async function (name) {
            const val = CONFIG.include[name];
            if (name === 'riot.js') {
            } else
            if (name === 'riot.min.js') {
            } else
            if (name === 'riot.csp.js') {    
            } else
            if (name === 'jquery') {    
            } else
            if (name === 'regenerator-runtime') {
            } else {
                if (typeof val !== 'string') {
                    throw new Error(`The value for an include directive must be a requireable id!`);
                }

                additionalIncludes.push(name);

                const fromPath = RESOLVE.sync(val, {
                    basedir: CONFIG.basedir
                });
                const toPath = PATH.join(baseDistPath, 'dist', name);

                options.result.inputPaths[fromPath] = true;
                options.result.outputPaths[toPath] = true;

                await FS.copy(fromPath, toPath);                    
            }
        }));
    }

    if (CONFIG.page) {

        CONFIG.indexFilename = CONFIG.indexFilename || 'page';

        let path;

        if (
            !CONFIG.indexFormat ||
            CONFIG.indexFormat === 'js'
        ) {
            path = await LIB['@pinf-it/core']({
                cwd: options.workspace.path,
                verbose: options.LIB.verbose
            }).runToolForModel(
                'gi0.PINF.it/build/v0',
                `/${LIB.PATH.relative(options.workspace.path, options.target.path)}`.replace(/\/\//g, '/'),
                `/${CONFIG.indexFilename}.js`,
                'it.pinf.org.browserify # build/v1',
                {
                    "src": PATH.join(__dirname, "../../src/page.js"),
                    "format": "pinf",
                    "variables": {
                        "DOCUMENT": CONFIG.page
                    },
                    "babel": CONFIG.babel || null
                },
                [
                    'onBuild:path'
                ]
            );
            // TODO: Add 'inputPaths' and 'outputPaths' from above tool to 'options.result.inputPaths' and 'options.result.outputPaths'
            options.result.inputPaths[PATH.join(__dirname, "../../src/page.js")] = true;
            options.result.outputPaths[path] = true;
        }

        if (
            !CONFIG.indexFormat ||
            CONFIG.indexFormat === 'html'
        ) {
            path = LIB.PATH.join(CONFIG.dist,`${CONFIG.indexFilename}.html`);
            await FS.outputFile(path, [
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
                        '<script name="jsonrep" src="dist/jsonrep.js" async="true"></script>',
                    '</head>',
                    '<body renderer="jsonrep" style="visibility:hidden;">' + JSON.stringify(CONFIG.page) + '</body>',
                '</html>'
            ].join("\n"), "utf8");
            options.result.outputPaths[path] = true;
        }
    }

}
