(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

function markupNode (config) {

    return "[" + config + "]";
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

},{}]},{},[1]);
