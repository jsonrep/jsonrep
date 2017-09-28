
const WINDOW = window;

// TODO: Optionally render into a specific container.
if (WINDOW.document.body.innerHTML) {
    throw new Error("Cannot render jsonrep page. Page 'body' element is not empty!");
}
WINDOW.document.body.setAttribute("renderer", "jsonrep");
WINDOW.document.body.innerHTML = "%%%DOCUMENT%%%";

// TODO: If 'PINF' loader is present, load jsonrep.js using it.

const baseUrl = [
    WINDOW.location.href.replace(/\/([^\/]*)$/, ""),
    // NOTE: 'pmodule' is the 'module' from the PINF wrapper of the browserify bundle.
    pmodule.filename.replace(/\/([^\/]*)$/, "")
].join("/").replace(/\/\.?\//g, "/").replace(/^([^:]+:\/)/, "$1/");

WINDOW.pmodule = pmodule;

const JSONREP = require("./jsonrep");

// TOOO: Allow multiple PINF loader instances to coordinate loading bundles.
WINDOW.PINF = JSONREP.PINF;
