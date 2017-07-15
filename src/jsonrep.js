
const WINDOW = (typeof window !== "undefined") ? window : null;


exports.renderElement = function (el) {

    el.innerHTML = "[" + el.innerHTML + "]";

}


function main () {

    function hook () {
        var elements = WINDOW.document.querySelectorAll('[renderer="jsonrep"]');
        elements.forEach(exports.renderElement);
    }

    if (WINDOW.document.readyState === "complete") {
        hook();
    } else {
        if (typeof WINDOW.addEventListener !== "undefined") {
            WINDOW.addEventListener("DOMContentLoaded", hook, false);
        } else {
            WINDOW.attachEvent("onload", hook)
        }
    }
}
main();
