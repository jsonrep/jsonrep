
function markupNode (config) {

    return "[" + config + "]";
}

((function (WINDOW) {

    exports.markupNode = markupNode;

    if (!WINDOW) {
        return null;
    }

    exports.markupElement = function (el) {
        el.innerHTML = exports.markupNode(el.innerHTML);
    }

    exports.markupDocument = function () {
        var elements = WINDOW.document.querySelectorAll('[renderer="jsonrep"]');
        elements.forEach(exports.markupElement);
    }

    if (WINDOW.document.readyState === "complete") {
        exports.markupDocument();
    } else {
        if (typeof WINDOW.addEventListener !== "undefined") {
            WINDOW.addEventListener("DOMContentLoaded", exports.markupDocument, false);
        } else {
            WINDOW.attachEvent("onload", exports.markupDocument);
        }
    }

})(
    (typeof window !== "undefined") ? window : null
));
