
function markupNode (config) {

    if (typeof config === "string") {
        try {
            config = JSON.parse(config);
        } catch (err) {
            throw new Error("Error parsing config from string! (" + err.message + ")");
        }
    }

console.log("config 1", config);

    if (config["@./dist/div"]) {

        return [
            '<div>',
            markupNode(config["@./dist/div"].innerHTML),
            '</div>'
        ].join("");

    } else
    if (config["@./dist/io.shields.img"]) {

        var aspects = config["@./dist/io.shields.img"];
        return '<img src="https://img.shields.io/badge/' + aspects.subject + '-' + aspects.status + '-' + aspects.color + '.svg">';

    } else {
        return "<pre>" + JSON.stringify(config, null, 4) + "</pre>";
    }
}

((function (WINDOW) {

    exports.markupNode = markupNode;

    if (!WINDOW) {
        return null;
    }

    // TODO: Optionally do not expose.
    WINDOW.jsonrep = exports;

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
