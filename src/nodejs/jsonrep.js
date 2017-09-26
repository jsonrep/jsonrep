
const PATH = require("path");
const JSONREP = require("../jsonrep");

JSONREP.options.ourBaseUri = PATH.join(__dirname, "../..");
JSONREP.options.defaultRenderer = function (JSONREP, node) {
    return JSON.stringify(node, null, 4);
}

JSONREP.PINF = require("./pinf-loader");

module.exports = JSONREP;
