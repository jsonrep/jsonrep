PINF.bundle("", function(__require) {
	__require.memoize("/main.js", function (_require, _exports, _module) {
var bundle = { require: _require, exports: _exports, module: _module };
var exports = undefined;
var module = undefined;
var define = function (deps, init) {
_module.exports = init();
}; define.amd = true;
       var pmodule = bundle.module;

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mainModule = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

exports.main = function (JSONREP, node, options) {
  return JSONREP.makeRep2({
    "config": {
      "node": node,
      "append": "!"
    },
    "code": function code(context, options) {
      var JSONREP = this;
      return {
        html: "<div></div>",
        "on": {
          "mount": function mount(el) {
            riot.util.styleManager.add = function (cssText, name) {
              if (!cssText) {
                return;
              }

              if (window.document.createStyleSheet) {
                var sheet = window.document.createStyleSheet();
                sheet.cssText = cssText;
              } else {
                var style = window.document.createElementNS ? window.document.createElementNS("http://www.w3.org/1999/xhtml", "style") : window.document.createElement("style");
                style.appendChild(window.document.createTextNode(cssText));
                var head = window.document.getElementsByTagName("head")[0] || window.document.documentElement;
                head.appendChild(style);
              }
            };

            riot.util.styleManager.inject = function () {
              if (!options) return;
              JSONREP.loadStyle(options.renderer.uri + '.css');
            };

            riot.tag('raw', '<div></div>', function (opts) {
              this.set = function () {
                this.root.childNodes[0].innerHTML = opts.html;
              };

              this.on('update', this.set);
              this.on('mount', this.set);
            });
            riot.tag2('tag_3eabafc45b6fb04af9f81a02db8bd832089df705', '<div></div>', 'tag_3eabafc45b6fb04af9f81a02db8bd832089df705,[data-is="tag_3eabafc45b6fb04af9f81a02db8bd832089df705"]{ border: 1px solid black; padding: 5px; }', '', function (opts) {
              this.root.innerHTML = [this.opts.config.node.message, this.opts.config.append].join("");
            });
            riot.mount(el, 'tag_3eabafc45b6fb04af9f81a02db8bd832089df705', context);
          }
        }
      };
    }
  }, options);
};
},{}]},{},[1])(1)
});

	});
});