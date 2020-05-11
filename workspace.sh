#!/usr/bin/env bash.origin.script

depend {
    "component": {
        "gi0.CADorn.org~component#s1": {
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
            }
        }
    }
}

BO_parse_args "ARGS" "$@"

if [ "$ARGS_1" == "publish" ]; then

    # TODO: Add option to track files and only publish if changed.
    CALL_component publish ${*:2}

elif [ "$ARGS_1" == "run" ]; then

    CALL_component run ${*:2}

fi
