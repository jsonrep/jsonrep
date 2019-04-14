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
    tag: T.DIV({
      "class": "unknown"
    }, "UNKNOWN EXPANDED"),
    collapsedTag: T.DIV({
      "class": "unknown"
    }, "UNKNOWN COLLAPSED"),
    shortTag: T.DIV({
      "class": "unknown"
    }, "UNKNOWN SHORT")
  };
}

function css() {
  return atob("CltfX2RiaWQ9IjAyOGQ5OTRiYzcwMmMzMGNjMzQ4MGI3YWMxMzAyODk3MTVjYzUzNmUiXSBESVYudW5rbm93biB7CiAgICBjb2xvcjogI0ZGRkZGRjsKICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDsKfQo=");
}

exports.main = function (options) {
  options = options || {};
  var domplate = window.domplate;
  var rep = impl(domplate);
  rep.__dom = {
"tag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __path__ = context.__path__;
var __bind__ = context.__bind__;
var __if__ = context.__if__;
var __link__ = context.__link__;
var __loop__ = context.__loop__;
return (function (root, context, o) {  DomplateDebug.startGroup([' .. Run DOM .. ','div'],arguments);  DomplateDebug.logJs('js','(function (root, context, o) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  }  DomplateDebug.endGroup();  return 1;})');  with (this) {  }  DomplateDebug.endGroup();  return 1;})
}
,
"collapsedTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __path__ = context.__path__;
var __bind__ = context.__bind__;
var __if__ = context.__if__;
var __link__ = context.__link__;
var __loop__ = context.__loop__;
return (function (root, context, o) {  DomplateDebug.startGroup([' .. Run DOM .. ','div'],arguments);  DomplateDebug.logJs('js','(function (root, context, o) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  }  DomplateDebug.endGroup();  return 1;})');  with (this) {  }  DomplateDebug.endGroup();  return 1;})
}
,
"shortTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __path__ = context.__path__;
var __bind__ = context.__bind__;
var __if__ = context.__if__;
var __link__ = context.__link__;
var __loop__ = context.__loop__;
return (function (root, context, o) {  DomplateDebug.startGroup([' .. Run DOM .. ','div'],arguments);  DomplateDebug.logJs('js','(function (root, context, o) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  }  DomplateDebug.endGroup();  return 1;})');  with (this) {  }  DomplateDebug.endGroup();  return 1;})
}
};
  rep.__markup = {
"tag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','div'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","unknown", " ", "\"",">","UNKNOWN EXPANDED","</div>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","unknown", " ", "\"",">","UNKNOWN EXPANDED","</div>");  }DomplateDebug.endGroup();}})
}
,
"collapsedTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','div'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","unknown", " ", "\"",">","UNKNOWN COLLAPSED","</div>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","unknown", " ", "\"",">","UNKNOWN COLLAPSED","</div>");  }DomplateDebug.endGroup();}})
}
,
"shortTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','div'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","unknown", " ", "\"",">","UNKNOWN SHORT","</div>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","unknown", " ", "\"",">","UNKNOWN SHORT","</div>");  }DomplateDebug.endGroup();}})
}
};
  var res = domplate.domplate(rep);
  var injectedCss = false;

  rep.__ensureCssInjected = function () {
    if (injectedCss) return;
    injectedCss = true;
    var node = document.createElement("style");
    var cssCode = css();

    if (options.cssBaseUrl) {
      cssCode = cssCode.replace(/(url\s*\()([^\)]+\))/g, "$1" + options.cssBaseUrl + "$2");
    }

    node.innerHTML = cssCode;
    document.body.appendChild(node);
  };

  rep.__dbid = "028d994bc702c30cc3480b7ac130289715cc536e";
  Object.keys(rep).forEach(function (tagName) {
    if (!rep[tagName].tag) return;
    res[tagName].__dbid = rep.__dbid;
    var replace_orig = res[tagName].replace;

    res[tagName].replace = function () {
      var res = replace_orig.apply(this, arguments);
      if (!res) return;
      res.parentNode.setAttribute("__dbid", rep.__dbid);
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