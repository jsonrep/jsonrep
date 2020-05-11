
const WINDOW = window;

// TODO: Optionally render into a specific container.
if (WINDOW.document.body.innerHTML.replace(/[\s\n]*/g, "")) {

    console.error(new Error("Cannot render jsonrep page. Page 'body' element is not empty!"));

} else {

    WINDOW.document.body.setAttribute("renderer", "jsonrep");
    WINDOW.document.body.innerHTML = "%%%DOCUMENT%%%";
    WINDOW.document.body.style.visibility = "hidden";

    try {
        const JSONREP = require("./jsonrep");

        JSONREP.options.ourBaseUri = bundle.module.filename.replace(/\/[^\/]+\/[^\/]+$/, '/dist');

    } catch (err) {
        console.error(err);
        throw err;
    }
}
