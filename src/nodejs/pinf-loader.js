
const FS = require("fs");
const VM = require("vm");
const LOADER = require("pinf-loader-js");


exports.sandbox = function (sandboxIdentifier, sandboxOptions, loadedCallback, errorCallback) {

    if (!sandboxIdentifier) {
        if (errorCallback) return errorCallback(new Error("'sandboxIdentifier' not specified"));
        throw new Error("'sandboxIdentifier' not specified");
    }

    if (typeof sandboxOptions === "function" && typeof loadedCallback === "function" && typeof errorCallback === "undefined") {
        errorCallback = loadedCallback;
        loadedCallback = sandboxOptions;
        sandboxOptions = {};
    } else
    if (typeof sandboxOptions === "function" && typeof loadedCallback === "undefined") {
        loadedCallback = sandboxOptions;
        sandboxOptions = {};
    } else {
        sandboxOptions = sandboxOptions || {};
    }

    var options = {};

    for (var key in sandboxOptions) {
        options[key] = sandboxOptions[key];
    }

    delete options.globals;

    // Set our own loader for the sandbox.
    options.load = function (uri, loadedCallback) {

        function loadCode(uri, callback) {
            if (/:\/\//.test(uri)) {
                return require("request")(uri, function(err, result) {
                    if (err) return callback(err);
                    return callback(null, result.body);
                });
            } else {
                return FS.readFile(uri, "utf8", callback);
            }
        }
        return loadCode(uri, function (err, code) {
            if (err) {
                console.error("Error reading file: " + sandboxOptions._realpath(uri));
                return loadedCallback(err);
            }
            try {
                evalBundle(uri, code);
                return loadedCallback(null);
            } catch(err) {
                return loadedCallback(err);
            }
        });
    }

    var domWindow = null;

    function evalBundle (uri, code) {
        // NOTE: If there are sytnax errors in code this will print
        //		 error to stdout (if fourth argument set to `true`).
        //		 There is no way to capture errors from here.
        // @see https://github.com/joyent/node/issues/1307#issuecomment-1551157
        // TODO: Find a better solution to handle errors here.
        // TODO: Capture errors by watching this processe's stdout file log from
        //		 another process.
        var globals = {
            // TODO: Inject and fix environment based on options.
            PINF: LOADER,
            // TODO: Wrap to `console` object provided by `sandboxOptions` and inject module info.
            console: console,
            // NodeJS globals.
            // @see http://nodejs.org/docs/latest/api/globals.html
            global: global,
            process: process,
            Buffer: Buffer,
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            setInterval: setInterval,
            clearInterval: clearInterval,
            setImmediate: setImmediate,
            ArrayBuffer: ArrayBuffer,
            Int8Array: Int8Array,
            Uint8Array: Uint8Array,
            Uint8ClampedArray: Uint8ClampedArray,
            Int16Array: Int16Array,
            Uint16Array: Uint16Array,
            Int32Array: Int32Array,
            Uint32Array: Uint32Array,
            Float32Array: Float32Array,
            Float64Array: Float64Array
        };

        if (sandboxOptions.includeBrowserGlobals === true) {
            // Browser
            globals.navigator = {};
            globals.window = domWindow;
            globals.document = domWindow.document;
            globals.location = domWindow.location;
        }

        if (sandboxOptions.globals) {
            for (var name in sandboxOptions.globals) {
                globals[name] = sandboxOptions.globals[name];
            }
        }
        if (sandboxOptions.test && sandboxOptions.rootPath) {
            globals.TEST_ROOT_PATH = sandboxOptions.rootPath;
        }
        if (sandboxOptions.debug) console.log("[pinf-for-nodejs] node vm exec:", uri);


        // Remove ES6 features so we can still use nodejs vm to exec code until it fully supports ES6.
        try {
            const BABEL = require("babel-core");
            var result = BABEL.transform(code, {
                "presets": [
                    require.resolve("babel-preset-es2015")
//					[require.resolve("babel-preset-es2015"), { "modules": false }]
                ]
            });
            code = result.code;
        } catch (err) {
                console.log("WARN: Got error while babelifying code '" + uri + "' but ignoring as source may already be proper ES5: " + err.message);
        }
        VM.runInNewContext(code, globals, {
            filename: uri,
            displayErrors: true
        });
    }

/*
    var lastModuleRequireContext = null;

    options.onInitModule = function(moduleInterface, moduleObj, pkg, sandbox, options) {
        if (typeof sandboxOptions.onInitModule === "function") {
            sandboxOptions.onInitModule(moduleInterface, moduleObj);
        }

        moduleInterface.filename = moduleInterface.filename;

        var origRequire = moduleObj.require;

        moduleObj.require = function (identifier) {

console.log("REQUIRE", identifier);   
            return origRequire.require.apply(null, arguments);
        }

        for (var property in origRequire) {
            moduleObj.require[property] = origRequire[property];
        }
    };

    options.onInitPackage = function(pkg, sandbox, options) {
        var origRequire = pkg.require;

        pkg.require = function(moduleIdentifier) {

console.log("load pakage", moduleIdentifier);

            // Now let the loader continue.
            return origRequire(moduleIdentifier);
        };

        for (var property in origRequire) {
            pkg.require[property] = origRequire[property];
        }
    }
*/

    return LOADER.sandbox(sandboxIdentifier, options, loadedCallback, errorCallback);
}