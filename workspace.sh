#!/usr/bin/env bash.origin.script

depend {
    "inception": {
        "@com.github/cadorn/Inception#s1": {
            "readme": "$__DIRNAME__/README.md",
            "variables": {
                "PACKAGE_NAME": "jsonrep",
                "PACKAGE_GITHUB_URI": "github.com/jsonrep/jsonrep",
                "PACKAGE_WEBSITE_SOURCE_URI": "github.com/jsonrep/jsonrep/tree/master/workspace.sh",
                "PACKAGE_CIRCLECI_NAMESPACE": "jsonrep/jsonrep",
                "PACKAGE_NPM_PACKAGE_NAME": "jsonrep",
                "PACKAGE_NPM_PACKAGE_URL": "https://www.npmjs.com/package/jsonrep",
                "PACKAGE_WEBSITE_URI": "jsonrep.github.io/jsonrep",
                "PACKAGE_YEAR_CREATED": "2017",
                "PACKAGE_LICENSE_ALIAS": "MPL",
                "PACKAGE_SUMMARY": "$__DIRNAME__/GUIDE.md"
            },
            "routes": {
                "/dist/div.rep.js": "$__DIRNAME__/dist/div.rep.js",
                "/dist/io.shields.img.rep.js": "$__DIRNAME__/dist/io.shields.img.rep.js",
                "/dist/jsonrep.js": {
                    "@it.pinf.org.browserify#s1": {
                        "src": "$__DIRNAME__/src/jsonrep.js",
                        "dist": "$__DIRNAME__/dist/jsonrep.js"
                    }
                },
                "/dist/insight.rep.js": {
                    "@it.pinf.org.browserify#s1": {
                        "src": "$__DIRNAME__/src/insight.rep.js",
                        "dist": "$__DIRNAME__/dist/insight.rep.js",
                        "format": "pinf"
                    }
                }
            },
            "files": {
                "dist/resources/insight.renderers.default": "$__DIRNAME__/node_modules/insight.renderers.default/resources"
            }
        }
    }
}

BO_parse_args "ARGS" "$@"

if [ "$ARGS_1" == "publish" ]; then

    # TODO: Add option to track files and only publish if changed.
    CALL_inception website publish ${*:2}

elif [ "$ARGS_1" == "run" ]; then

    CALL_inception website run ${*:2}

fi
