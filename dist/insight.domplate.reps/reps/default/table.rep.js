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
    VAR_hideShortTagOnExpand: false,
    tag: T.DIV({
      "class": "table"
    }, T.TABLE({
      "cellpadding": 3,
      "cellspacing": 0
    }, T.TBODY(T.TR({
      "class": "$node|getHeaderClass"
    }, T.FOR("column", "$context,$node|getHeaders", T.TH({
      "class": "header"
    }, T.TAG("$column.tag", {
      "node": "$column.node"
    }))), T.IF("$node|hasNoHeader", T.TH())), T.FOR("row", "$node|getRows", T.TR(T.FOR("cell", "$context,$row|getCells", T.TD({
      "class": "cell",
      "_cellNodeObj": "$cell.node",
      "onclick": "$onCellClick",
      "__dbid": "$cell.dbid"
    }, T.TAG("$cell.tag", {
      "node": "$cell.node",
      "context": "$context"
    })))))))),
    shortTag: T.SPAN({
      "class": "table",
      "__dbid": "$context,$node|getTitleTagDbid"
    }, T.TAG("$context,$node|getTitleTag", {
      "node": "$node|getTitleNode",
      "context": "$context"
    })),
    getTitleTagDbid: function getTitleTagDbid(context, node) {
      var tag = this.getTitleTag(context, node);
      if (!tag) return '';
      return tag.__dbid;
    },
    getTitleTag: function getTitleTag(context, node) {
      var rep = context.repForNode(this.getTitleNode(node));
      return rep.shortTag || rep.tag;
    },
    getTitleNode: function getTitleNode(node) {
      return domplate.util.merge(node.value.title, {
        "wrapped": false
      });
    },
    getHeaderClass: function getHeaderClass(node) {
      if (this.hasNoHeader(node)) {
        return "hide";
      } else {
        return "";
      }
    },
    hasNoHeader: function hasNoHeader(node) {
      return !node.value.header;
    },
    getHeaders: function getHeaders(context, node) {
      var header = node.value.header;
      var items = [];

      for (var i = 0; i < header.length; i++) {
        var rep = context.repForNode(header[i]);
        items.push({
          "node": domplate.util.merge(header[i], {
            "wrapped": false
          }),
          "tag": rep.shortTag || rep.tag
        });
      }

      return items;
    },
    getRows: function getRows(node) {
      return node.value.body || [];
    },
    getCells: function getCells(context, row) {
      var items = [];

      if (domplate.util.isArrayLike(row)) {
        for (var i = 0; i < row.length; i++) {
          var rep = context.repForNode(row[i]);
          var item = {
            "node": domplate.util.merge(row[i], {
              "wrapped": false
            }),
            "tag": rep.shortTag || rep.tag
          };

          if (item.tag) {
            item.dbid = item.tag.__dbid;
          }

          items.push(item);
        }
      } else if (row.meta && row.meta['encoder.trimmed']) {
        var rep = context.repForNode(row);
        var item = {
          "node": domplate.util.merge(row, {
            "wrapped": false
          }),
          "tag": rep.shortTag || rep.tag
        };

        if (item.tag) {
          item.dbid = item.tag.__dbid;
        }

        items.push(item);
      }

      return items;
    },
    onCellClick: function onCellClick(event) {
      event.stopPropagation();
      var tag = event.target;

      while (tag.parentNode) {
        if (tag.cellNodeObj) {
          break;
        }

        tag = tag.parentNode;
      }

      domplate.dispatchEvent('inspectNode', [event, {
        "args": {
          "node": tag.cellNodeObj
        }
      }]);
    },
    _getMasterRow: function _getMasterRow(row) {
      while (true) {
        if (!row.parentNode) {
          return null;
        }

        if (domplate.util.hasClass(row, "console-message")) {
          break;
        }

        row = row.parentNode;
      }

      return row;
    }
  };
}

function css() {
  return atob("CltfX2RiaWQ9IjIyZjRiZTk1ZjVmYWM1YjkzZDkyODhiNTcwOWM3Y2UzMjA4ZDlhMWEiXSBTUEFOLnRhYmxlIHsKICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChpbWFnZXMvdGFibGUucG5nKTsKICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7CiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiA0cHggLTFweDsKICAgIHBhZGRpbmctbGVmdDogMjVweDsKfQoKW19fZGJpZD0iMjJmNGJlOTVmNWZhYzViOTNkOTI4OGI1NzA5YzdjZTMyMDhkOWExYSJdIERJVi50YWJsZSB7CiAgICBwYWRkaW5nOiAwcHg7CiAgICBtYXJnaW46IDBweDsKfQoKW19fZGJpZD0iMjJmNGJlOTVmNWZhYzViOTNkOTI4OGI1NzA5YzdjZTMyMDhkOWExYSJdIERJVi50YWJsZSBUQUJMRSB7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNEN0Q3RDc7CiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI0Q3RDdENzsKfQoKW19fZGJpZD0iMjJmNGJlOTVmNWZhYzViOTNkOTI4OGI1NzA5YzdjZTMyMDhkOWExYSJdIERJVi50YWJsZSBUQUJMRSBUQk9EWSBUUi5oaWRlIHsKICBkaXNwbGF5OiBub25lOwp9CgpbX19kYmlkPSIyMmY0YmU5NWY1ZmFjNWI5M2Q5Mjg4YjU3MDljN2NlMzIwOGQ5YTFhIl0gRElWLnRhYmxlIFRBQkxFIFRCT0RZIFRSIFRILmhlYWRlciB7CiAgdmVydGljYWwtYWxpZ246IHRvcDsKICBmb250LXdlaWdodDogYm9sZDsKICB0ZXh0LWFsaWduOiBjZW50ZXI7CiAgYm9yZGVyOiAxcHggc29saWQgI0Q3RDdENzsKICBib3JkZXItYm90dG9tOiAwcHg7CiAgYm9yZGVyLXJpZ2h0OiAwcHg7CiAgYmFja2dyb3VuZC1jb2xvcjogI2VjZWNlYzsKICBwYWRkaW5nOiAycHg7CiAgcGFkZGluZy1sZWZ0OiAxMHB4OwogIHBhZGRpbmctcmlnaHQ6IDEwcHg7Cn0KCltfX2RiaWQ9IjIyZjRiZTk1ZjVmYWM1YjkzZDkyODhiNTcwOWM3Y2UzMjA4ZDlhMWEiXSBESVYudGFibGUgVEFCTEUgVEJPRFkgVFIgVEQuY2VsbCB7CiAgdmVydGljYWwtYWxpZ246IHRvcDsKICBwYWRkaW5nLXJpZ2h0OiAxMHB4OwogIGJvcmRlcjogMXB4IHNvbGlkICNEN0Q3RDc7CiAgYm9yZGVyLWJvdHRvbTogMHB4OwogIGJvcmRlci1yaWdodDogMHB4OwogIHBhZGRpbmc6IDJweDsKICBwYWRkaW5nLWxlZnQ6IDEwcHg7CiAgcGFkZGluZy1yaWdodDogMTBweDsKfQoKW19fZGJpZD0iMjJmNGJlOTVmNWZhYzViOTNkOTI4OGI1NzA5YzdjZTMyMDhkOWExYSJdIERJVi50YWJsZSBUQUJMRSBUQk9EWSBUUiBURC5jZWxsOmhvdmVyIHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmM3M2Q7CiAgICBjdXJzb3I6IHBvaW50ZXI7ICAgIAp9ICAgICAgICAK");
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
return (function (root, context, o, d0, d1, d2) {  DomplateDebug.startGroup([' .. Run DOM .. ','div'],arguments);  DomplateDebug.logJs('js','(function (root, context, o, d0, d1, d2) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  var l0 = 0;  var l1 = 0;  var l2 = 0;  var if_0 = 0;  var e0 = 0;  var e1 = 0;  with (this) {      l0 = __loop__.apply(this, [d0, function(i0,l0,d0,d1) {       DomplateDebug.logVar(\'  .. i0 (counterName)\',i0);       DomplateDebug.logVar(\'  .. l0 (loopName)\',l0);        node = __path__(root, o,0,0,0,0+l0+0,0);        e0 = __link__(node, d0, d1);        return 0+1;      }]);      if_0 = __if__.apply(this, [d1, function(if_0) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_0 (ifName)\',if_0);      }]);      l1 = __loop__.apply(this, [d2, function(i1,l1,d0) {       DomplateDebug.logVar(\'  .. i1 (counterName)\',i1);       DomplateDebug.logVar(\'  .. l1 (loopName)\',l1);      l2 = __loop__.apply(this, [d0, function(i2,l2,d0,d1,d2,d3) {       DomplateDebug.logVar(\'  .. i2 (counterName)\',i2);       DomplateDebug.logVar(\'  .. l2 (loopName)\',l2);        node = __path__(root, o,0,0,0+1+l1+0,0+l2+0);node.addEventListener("click", __bind__(this, d0), false);node.cellNodeObj = d1;        node = __path__(root, o,0,0,0+1+l1+0,0+l2+0,0);        e1 = __link__(node, d2, d3);        return 0+1;      }]);        return 0+1;      }]);  }  DomplateDebug.endGroup();  return 1;})');  var l0 = 0;  var l1 = 0;  var l2 = 0;  var if_0 = 0;  var e0 = 0;  var e1 = 0;  with (this) {      l0 = __loop__.apply(this, [d0, function(i0,l0,d0,d1) {       DomplateDebug.logVar('  .. i0 (counterName)',i0);       DomplateDebug.logVar('  .. l0 (loopName)',l0);        node = __path__(root, o,0,0,0,0+l0+0,0);        e0 = __link__(node, d0, d1);        return 0+1;      }]);      if_0 = __if__.apply(this, [d1, function(if_0) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_0 (ifName)',if_0);      }]);      l1 = __loop__.apply(this, [d2, function(i1,l1,d0) {       DomplateDebug.logVar('  .. i1 (counterName)',i1);       DomplateDebug.logVar('  .. l1 (loopName)',l1);      l2 = __loop__.apply(this, [d0, function(i2,l2,d0,d1,d2,d3) {       DomplateDebug.logVar('  .. i2 (counterName)',i2);       DomplateDebug.logVar('  .. l2 (loopName)',l2);        node = __path__(root, o,0,0,0+1+l1+0,0+l2+0);node.addEventListener("click", __bind__(this, d0), false);node.cellNodeObj = d1;        node = __path__(root, o,0,0,0+1+l1+0,0+l2+0,0);        e1 = __link__(node, d2, d3);        return 0+1;      }]);        return 0+1;      }]);  }  DomplateDebug.endGroup();  return 1;})
}
,
"shortTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __path__ = context.__path__;
var __bind__ = context.__bind__;
var __if__ = context.__if__;
var __link__ = context.__link__;
var __loop__ = context.__loop__;
return (function (root, context, o, d0, d1) {  DomplateDebug.startGroup([' .. Run DOM .. ','span'],arguments);  DomplateDebug.logJs('js','(function (root, context, o, d0, d1) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'span\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  var e0 = 0;  with (this) {        node = __path__(root, o,0);        e0 = __link__(node, d0, d1);  }  DomplateDebug.endGroup();  return 1;})');  var e0 = 0;  with (this) {        node = __path__(root, o,0);        e0 = __link__(node, d0, d1);  }  DomplateDebug.endGroup();  return 1;})
}
};
  rep.__markup = {
"tag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','div'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","table", " ", "\"",">","<table", " cellpadding=\"","3", "\"", " cellspacing=\"","0", "\"", " class=\"", " ", "\"",">","<tbody", " class=\"", " ", "\"",">","<tr", " class=\"",__escape__(getHeaderClass(node)), " ", "\"",">");    __loop__.apply(this, [getHeaders(context,node), __out__, function(column, __out__) {    __code__.push("","<th", " class=\"","header", " ", "\"",">");__link__(column.tag, __code__, __out__, {"node":column.node});    __code__.push("","</th>");    }]);__if__.apply(this, [hasNoHeader(node), __out__, function(__out__) {    __code__.push("","<th", " class=\"", " ", "\"",">","</th>");}]);    __code__.push("","</tr>");    __loop__.apply(this, [getRows(node), __out__, function(row, __out__) {    __code__.push("","<tr", " class=\"", " ", "\"",">");    __loop__.apply(this, [getCells(context,row), __out__, function(cell, __out__) {    __code__.push("","<td", " __dbid=\"",__escape__(cell.dbid), "\"", " class=\"","cell", " ", "\"",">");__out__.push(onCellClick,cell.node);__link__(cell.tag, __code__, __out__, {"node":cell.node,"context":context});    __code__.push("","</td>");    }]);    __code__.push("","</tr>");    }]);    __code__.push("","</tbody>","</table>","</div>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","table", " ", "\"",">","<table", " cellpadding=\"","3", "\"", " cellspacing=\"","0", "\"", " class=\"", " ", "\"",">","<tbody", " class=\"", " ", "\"",">","<tr", " class=\"",__escape__(getHeaderClass(node)), " ", "\"",">");    __loop__.apply(this, [getHeaders(context,node), __out__, function(column, __out__) {    __code__.push("","<th", " class=\"","header", " ", "\"",">");__link__(column.tag, __code__, __out__, {"node":column.node});    __code__.push("","</th>");    }]);__if__.apply(this, [hasNoHeader(node), __out__, function(__out__) {    __code__.push("","<th", " class=\"", " ", "\"",">","</th>");}]);    __code__.push("","</tr>");    __loop__.apply(this, [getRows(node), __out__, function(row, __out__) {    __code__.push("","<tr", " class=\"", " ", "\"",">");    __loop__.apply(this, [getCells(context,row), __out__, function(cell, __out__) {    __code__.push("","<td", " __dbid=\"",__escape__(cell.dbid), "\"", " class=\"","cell", " ", "\"",">");__out__.push(onCellClick,cell.node);__link__(cell.tag, __code__, __out__, {"node":cell.node,"context":context});    __code__.push("","</td>");    }]);    __code__.push("","</tr>");    }]);    __code__.push("","</tbody>","</table>","</div>");  }DomplateDebug.endGroup();}})
}
,
"shortTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','span'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'span\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<span", " __dbid=\"",__escape__(getTitleTagDbid(context,node)), "\"", " class=\"","table", " ", "\"",">");__link__(getTitleTag(context,node), __code__, __out__, {"node":getTitleNode(node),"context":context});    __code__.push("","</span>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<span", " __dbid=\"",__escape__(getTitleTagDbid(context,node)), "\"", " class=\"","table", " ", "\"",">");__link__(getTitleTag(context,node), __code__, __out__, {"node":getTitleNode(node),"context":context});    __code__.push("","</span>");  }DomplateDebug.endGroup();}})
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

  rep.__dbid = "22f4be95f5fac5b93d9288b5709c7ce3208d9a1a";
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