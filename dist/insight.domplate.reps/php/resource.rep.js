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


function impl(domplate) {
  var T = domplate.tags;
  return {
    tag: T.SPAN({
      "class": "resource"
    }, "[$node|getValue]"),
    shortTag: T.SPAN({
      "class": "resource"
    }, "[$node|getValue]"),
    getValue: function getValue(node) {
      return node.value.toUpperCase();
    }
  };
}

exports.main = function (domplate, options) {
  options = options || {};
  var rep = impl(domplate);
  rep.__dom = {
"tag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __path__ = context.__path__;
var __bind__ = context.__bind__;
var __if__ = context.__if__;
var __link__ = context.__link__;
var __loop__ = context.__loop__;
return (function (root, context, o) {  with (this) {  }  return 1;})
}
,
"shortTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __path__ = context.__path__;
var __bind__ = context.__bind__;
var __if__ = context.__if__;
var __link__ = context.__link__;
var __loop__ = context.__loop__;
return (function (root, context, o) {  with (this) {  }  return 1;})
}
};
  rep.__markup = {
"tag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  with (this) {  with (__in__) {    __code__.push("","<span", " __dbid=\"","4a4960b1fa287b63ab13aa5373caa1f7076ff7e5", "\"", " __dtid=\"","insight.domplate.reps/php/resource", "\"", " class=\"","resource", " ", "\"",">","[",__escape__(getValue(node)),"]","</span>");  }}})
}
,
"shortTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  with (this) {  with (__in__) {    __code__.push("","<span", " __dbid=\"","4a4960b1fa287b63ab13aa5373caa1f7076ff7e5", "\"", " __dtid=\"","insight.domplate.reps/php/resource", "\"", " class=\"","resource", " ", "\"",">","[",__escape__(getValue(node)),"]","</span>");  }}})
}
};
  rep.__dbid = "4a4960b1fa287b63ab13aa5373caa1f7076ff7e5";
  rep.__dtid = "insight.domplate.reps/php/resource";
  var res = domplate.domplate(rep);
  var injectedCss = false;

  rep.__ensureCssInjected = function () {
    if (injectedCss) return;
    injectedCss = true;
    domplate.loadStyle("php/resource.rep.css", options.cssBaseUrl || undefined);
  };

  Object.keys(rep).forEach(function (tagName) {
    if (!rep[tagName].tag) return;
    var replace_orig = res[tagName].replace;

    res[tagName].replace = function () {
      var res = replace_orig.apply(this, arguments);
      if (!res) return;
      setTimeout(function () {
        rep.__ensureCssInjected();
      }, 0);
      return res;
    };
  });
  return res;
};
},{}]},{},[1])(1)
});

	});
});