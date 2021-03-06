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
    VAR_wrapped: false,
    tag: T.SPAN({
      "class": "string",
      "wrapped": "$node.wrapped"
    }, T.IF("$node.wrapped", "'"), T.FOR("line", "$node|getValue", "$line.value", T.IF("$line.special", T.SPAN({
      "class": "special"
    }, "$line.specialvalue")), T.IF("$line.more", T.BR()), T.IF("$line.trimmed", T.TAG("$node|getTrimmedTag", {
      "node": "$node"
    }))), T.IF("$node.wrapped", "'")),
    shortTag: T.SPAN({
      "class": "string",
      "wrapped": "$node.wrapped"
    }, T.IF("$node.wrapped", "'"), T.FOR("line", "$node|getShortValue", "$line.value", T.IF("$line.special", T.SPAN({
      "class": "special"
    }, "$line.specialvalue")), T.IF("$line.more", T.BR()), T.IF("$line.trimmed", T.TAG("$node|getTrimmedTag", {
      "node": "$node"
    }))), T.IF("$node.wrapped", "'")),
    trimmedNoticeTag: T.SPAN({
      "class": "trimmed"
    }, "$node|getNotice"),
    getNotice: function getNotice(node) {
      return node.meta["encoder.notice"];
    },
    getTrimmedTag: function getTrimmedTag() {
      return this.trimmedNoticeTag;
    },
    getValue: function getValue(node) {
      var parts = node.value.split("\\n");
      var lines = [];

      for (var i = 0, c = parts.length; i < c; i++) {
        lines.push({
          "value": parts[i],
          "more": i < c - 1 ? true : false,
          "special": false
        });
      }

      if (node.meta["encoder.trimmed"] && node.meta["encoder.notice"]) {
        lines.push({
          "value": "",
          "trimmed": true
        });
      }

      return lines;
    },
    getShortValue: function getShortValue(node) {
      var trimEnabled = true;
      var trimLength = 50;
      var trimNewlines = true;
      var meta = typeof node.getObjectGraph === "function" ? node.getObjectGraph().getMeta() : null;

      if (meta) {
        if (!node.parentNode) {
          if (typeof meta["string.trim.enabled"] == "undefined" || !meta["string.trim.enabled"]) {
            trimLength = 500;
          }
        }

        if (typeof meta["string.trim.enabled"] != "undefined") {
          trimEnabled = meta["string.trim.enabled"];
        }

        if (typeof meta["string.trim.length"] != "undefined" && meta["string.trim.length"] >= 5) {
          trimLength = meta["string.trim.length"];
        }

        if (typeof meta["string.trim.newlines"] != "undefined") {
          trimNewlines = meta["string.trim.newlines"];
        }
      }

      var str = node.value;

      if (trimEnabled) {
        if (trimLength > -1) {
          str = this._cropString(str, trimLength);
        }

        if (trimNewlines) {
          str = this._escapeNewLines(str);
        }
      }

      var parts = str.split("\\n");
      var lines = [],
          parts2;

      for (var i = 0, ci = parts.length; i < ci; i++) {
        parts2 = parts[i].split("|:_!_:|");

        for (var j = 0, cj = parts2.length; j < cj; j++) {
          if (parts2[j] == "STRING_CROP") {
            lines.push({
              "value": "",
              "more": false,
              "special": true,
              "specialvalue": "..."
            });
          } else if (parts2[j] == "STRING_NEWLINE") {
            lines.push({
              "value": "",
              "more": false,
              "special": true,
              "specialvalue": "\\\n"
            });
          } else {
            lines.push({
              "value": parts2[j],
              "more": i < ci - 1 && j == cj - 1 ? true : false
            });
          }
        }
      }

      if (node.meta["encoder.trimmed"] && node.meta["encoder.notice"]) {
        lines.push({
          "value": "",
          "trimmed": true
        });
      }

      return lines;
    },
    _cropString: function _cropString(value, limit) {
      limit = limit || 50;

      if (value.length > limit) {
        return value.substr(0, limit / 2) + "|:_!_:|STRING_CROP|:_!_:|" + value.substr(value.length - limit / 2);
      } else {
        return value;
      }
    },
    _escapeNewLines: function _escapeNewLines(value) {
      return ("" + value).replace(/\r/g, "\\r").replace(/\\n/g, "|:_!_:|STRING_NEWLINE|:_!_:|");
    }
  };
}

function css() {
  return atob("CltfX2RiaWQ9IjY4NWY1YmVkM2I1ZDY2ZTc1NmQxOGMzY2ExMDQwMjI4M2MyNWVlYjMiXSBTUEFOLm51bGwgewogICAgY29sb3I6IG5hdnk7Cn0KCltfX2RiaWQ9IjY4NWY1YmVkM2I1ZDY2ZTc1NmQxOGMzY2ExMDQwMjI4M2MyNWVlYjMiXSBTUEFOLnN0cmluZyB7CiAgICBjb2xvcjogYmxhY2s7Cn0KCltfX2RiaWQ9IjY4NWY1YmVkM2I1ZDY2ZTc1NmQxOGMzY2ExMDQwMjI4M2MyNWVlYjMiXSBTUEFOLnN0cmluZ1t3cmFwcGVkPXRydWVdIHsKICAgIGNvbG9yOiByZWQ7Cn0KCltfX2RiaWQ9IjY4NWY1YmVkM2I1ZDY2ZTc1NmQxOGMzY2ExMDQwMjI4M2MyNWVlYjMiXSBTUEFOLnN0cmluZyA+IFNQQU4uc3BlY2lhbCB7CiAgICBjb2xvcjogZ3JheTsKICAgIGZvbnQtd2VpZ2h0OiBib2xkOwogICAgcGFkZGluZy1sZWZ0OiAzcHg7CiAgICBwYWRkaW5nLXJpZ2h0OiAzcHg7Cn0KCltfX2RiaWQ9IjY4NWY1YmVkM2I1ZDY2ZTc1NmQxOGMzY2ExMDQwMjI4M2MyNWVlYjMiXSBTUEFOLnN0cmluZyA+IFNQQU4udHJpbW1lZCB7CiAgICBjb2xvcjogI0ZGRkZGRjsKICAgIGJhY2tncm91bmQtY29sb3I6IGJsdWU7CiAgICBwYWRkaW5nLWxlZnQ6IDVweDsKICAgIHBhZGRpbmctcmlnaHQ6IDVweDsKICAgIG1hcmdpbi1sZWZ0OiA1cHg7Cn0K");
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
return (function (root, context, o, d0, d1, d2) {  DomplateDebug.startGroup([' .. Run DOM .. ','span'],arguments);  DomplateDebug.logJs('js','(function (root, context, o, d0, d1, d2) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'span\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  var l0 = 0;  var if_0 = 0;  var if_1 = 0;  var if_2 = 0;  var if_3 = 0;  var if_4 = 0;  var e0 = 0;  with (this) {      if_0 = __if__.apply(this, [d0, function(if_0) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_0 (ifName)\',if_0);      }]);      l0 = __loop__.apply(this, [d1, function(i0,l0,d0,d1,d2) {       DomplateDebug.logVar(\'  .. i0 (counterName)\',i0);       DomplateDebug.logVar(\'  .. l0 (loopName)\',l0);      if_1 = __if__.apply(this, [d0, function(if_1) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_1 (ifName)\',if_1);      }]);      if_2 = __if__.apply(this, [d1, function(if_2) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_2 (ifName)\',if_2);      }]);      if_3 = __if__.apply(this, [d2, function(if_3,d0,d1) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_3 (ifName)\',if_3);        node = __path__(root, o,0+d0+l0+0+1+d0+d1);        e0 = __link__(node, d0, d1);      }]);        return 0+1+d0+d1+d2;      }]);      if_4 = __if__.apply(this, [d2, function(if_4) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_4 (ifName)\',if_4);      }]);  }  DomplateDebug.endGroup();  return 1;})');  var l0 = 0;  var if_0 = 0;  var if_1 = 0;  var if_2 = 0;  var if_3 = 0;  var if_4 = 0;  var e0 = 0;  with (this) {      if_0 = __if__.apply(this, [d0, function(if_0) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_0 (ifName)',if_0);      }]);      l0 = __loop__.apply(this, [d1, function(i0,l0,d0,d1,d2) {       DomplateDebug.logVar('  .. i0 (counterName)',i0);       DomplateDebug.logVar('  .. l0 (loopName)',l0);      if_1 = __if__.apply(this, [d0, function(if_1) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_1 (ifName)',if_1);      }]);      if_2 = __if__.apply(this, [d1, function(if_2) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_2 (ifName)',if_2);      }]);      if_3 = __if__.apply(this, [d2, function(if_3,d0,d1) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_3 (ifName)',if_3);        node = __path__(root, o,0+d0+l0+0+1+d0+d1);        e0 = __link__(node, d0, d1);      }]);        return 0+1+d0+d1+d2;      }]);      if_4 = __if__.apply(this, [d2, function(if_4) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_4 (ifName)',if_4);      }]);  }  DomplateDebug.endGroup();  return 1;})
}
,
"shortTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __path__ = context.__path__;
var __bind__ = context.__bind__;
var __if__ = context.__if__;
var __link__ = context.__link__;
var __loop__ = context.__loop__;
return (function (root, context, o, d0, d1, d2) {  DomplateDebug.startGroup([' .. Run DOM .. ','span'],arguments);  DomplateDebug.logJs('js','(function (root, context, o, d0, d1, d2) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'span\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  var l0 = 0;  var if_0 = 0;  var if_1 = 0;  var if_2 = 0;  var if_3 = 0;  var if_4 = 0;  var e0 = 0;  with (this) {      if_0 = __if__.apply(this, [d0, function(if_0) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_0 (ifName)\',if_0);      }]);      l0 = __loop__.apply(this, [d1, function(i0,l0,d0,d1,d2) {       DomplateDebug.logVar(\'  .. i0 (counterName)\',i0);       DomplateDebug.logVar(\'  .. l0 (loopName)\',l0);      if_1 = __if__.apply(this, [d0, function(if_1) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_1 (ifName)\',if_1);      }]);      if_2 = __if__.apply(this, [d1, function(if_2) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_2 (ifName)\',if_2);      }]);      if_3 = __if__.apply(this, [d2, function(if_3,d0,d1) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_3 (ifName)\',if_3);        node = __path__(root, o,0+d0+l0+0+1+d0+d1);        e0 = __link__(node, d0, d1);      }]);        return 0+1+d0+d1+d2;      }]);      if_4 = __if__.apply(this, [d2, function(if_4) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_4 (ifName)\',if_4);      }]);  }  DomplateDebug.endGroup();  return 1;})');  var l0 = 0;  var if_0 = 0;  var if_1 = 0;  var if_2 = 0;  var if_3 = 0;  var if_4 = 0;  var e0 = 0;  with (this) {      if_0 = __if__.apply(this, [d0, function(if_0) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_0 (ifName)',if_0);      }]);      l0 = __loop__.apply(this, [d1, function(i0,l0,d0,d1,d2) {       DomplateDebug.logVar('  .. i0 (counterName)',i0);       DomplateDebug.logVar('  .. l0 (loopName)',l0);      if_1 = __if__.apply(this, [d0, function(if_1) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_1 (ifName)',if_1);      }]);      if_2 = __if__.apply(this, [d1, function(if_2) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_2 (ifName)',if_2);      }]);      if_3 = __if__.apply(this, [d2, function(if_3,d0,d1) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_3 (ifName)',if_3);        node = __path__(root, o,0+d0+l0+0+1+d0+d1);        e0 = __link__(node, d0, d1);      }]);        return 0+1+d0+d1+d2;      }]);      if_4 = __if__.apply(this, [d2, function(if_4) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_4 (ifName)',if_4);      }]);  }  DomplateDebug.endGroup();  return 1;})
}
,
"trimmedNoticeTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __path__ = context.__path__;
var __bind__ = context.__bind__;
var __if__ = context.__if__;
var __link__ = context.__link__;
var __loop__ = context.__loop__;
return (function (root, context, o) {  DomplateDebug.startGroup([' .. Run DOM .. ','span'],arguments);  DomplateDebug.logJs('js','(function (root, context, o) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'span\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  }  DomplateDebug.endGroup();  return 1;})');  with (this) {  }  DomplateDebug.endGroup();  return 1;})
}
};
  rep.__markup = {
"tag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','span'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'span\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<span", " wrapped=\"",__escape__(node.wrapped), "\"", " class=\"","string", " ", "\"",">");__if__.apply(this, [node.wrapped, __out__, function(__out__) {    __code__.push("","\'");}]);    __loop__.apply(this, [getValue(node), __out__, function(line, __out__) {    __code__.push("",__escape__(line.value));__if__.apply(this, [line.special, __out__, function(__out__) {    __code__.push("","<span", " class=\"","special", " ", "\"",">",__escape__(line.specialvalue),"</span>");}]);__if__.apply(this, [line.more, __out__, function(__out__) {    __code__.push("","<br", " class=\"", " ", "\"","/>");}]);__if__.apply(this, [line.trimmed, __out__, function(__out__) {__link__(getTrimmedTag(node), __code__, __out__, {"node":node});}]);    }]);__if__.apply(this, [node.wrapped, __out__, function(__out__) {    __code__.push("","\'");}]);    __code__.push("","</span>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<span", " wrapped=\"",__escape__(node.wrapped), "\"", " class=\"","string", " ", "\"",">");__if__.apply(this, [node.wrapped, __out__, function(__out__) {    __code__.push("","'");}]);    __loop__.apply(this, [getValue(node), __out__, function(line, __out__) {    __code__.push("",__escape__(line.value));__if__.apply(this, [line.special, __out__, function(__out__) {    __code__.push("","<span", " class=\"","special", " ", "\"",">",__escape__(line.specialvalue),"</span>");}]);__if__.apply(this, [line.more, __out__, function(__out__) {    __code__.push("","<br", " class=\"", " ", "\"","/>");}]);__if__.apply(this, [line.trimmed, __out__, function(__out__) {__link__(getTrimmedTag(node), __code__, __out__, {"node":node});}]);    }]);__if__.apply(this, [node.wrapped, __out__, function(__out__) {    __code__.push("","'");}]);    __code__.push("","</span>");  }DomplateDebug.endGroup();}})
}
,
"shortTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','span'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'span\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<span", " wrapped=\"",__escape__(node.wrapped), "\"", " class=\"","string", " ", "\"",">");__if__.apply(this, [node.wrapped, __out__, function(__out__) {    __code__.push("","\'");}]);    __loop__.apply(this, [getShortValue(node), __out__, function(line, __out__) {    __code__.push("",__escape__(line.value));__if__.apply(this, [line.special, __out__, function(__out__) {    __code__.push("","<span", " class=\"","special", " ", "\"",">",__escape__(line.specialvalue),"</span>");}]);__if__.apply(this, [line.more, __out__, function(__out__) {    __code__.push("","<br", " class=\"", " ", "\"","/>");}]);__if__.apply(this, [line.trimmed, __out__, function(__out__) {__link__(getTrimmedTag(node), __code__, __out__, {"node":node});}]);    }]);__if__.apply(this, [node.wrapped, __out__, function(__out__) {    __code__.push("","\'");}]);    __code__.push("","</span>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<span", " wrapped=\"",__escape__(node.wrapped), "\"", " class=\"","string", " ", "\"",">");__if__.apply(this, [node.wrapped, __out__, function(__out__) {    __code__.push("","'");}]);    __loop__.apply(this, [getShortValue(node), __out__, function(line, __out__) {    __code__.push("",__escape__(line.value));__if__.apply(this, [line.special, __out__, function(__out__) {    __code__.push("","<span", " class=\"","special", " ", "\"",">",__escape__(line.specialvalue),"</span>");}]);__if__.apply(this, [line.more, __out__, function(__out__) {    __code__.push("","<br", " class=\"", " ", "\"","/>");}]);__if__.apply(this, [line.trimmed, __out__, function(__out__) {__link__(getTrimmedTag(node), __code__, __out__, {"node":node});}]);    }]);__if__.apply(this, [node.wrapped, __out__, function(__out__) {    __code__.push("","'");}]);    __code__.push("","</span>");  }DomplateDebug.endGroup();}})
}
,
"trimmedNoticeTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','span'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'span\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<span", " class=\"","trimmed", " ", "\"",">",__escape__(getNotice(node)),"</span>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<span", " class=\"","trimmed", " ", "\"",">",__escape__(getNotice(node)),"</span>");  }DomplateDebug.endGroup();}})
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

  rep.__dbid = "685f5bed3b5d66e756d18c3ca10402283c25eeb3";
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