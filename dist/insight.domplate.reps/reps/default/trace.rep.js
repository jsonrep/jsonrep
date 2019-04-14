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
      "class": "structures-trace"
    }, T.TABLE({
      "cellpadding": 3,
      "cellspacing": 0
    }, T.TBODY(T.TR(T.TH({
      "class": "header-file"
    }, "File"), T.TH({
      "class": "header-line"
    }, "Line"), T.TH({
      "class": "header-inst"
    }, "Instruction")), T.FOR("frame", "$node|getCallList", T.TR({
      "_frameNodeObj": "$frame.node"
    }, T.TD({
      "class": "cell-file",
      "onclick": "$onFileClick"
    }, "$frame.file"), T.TD({
      "class": "cell-line",
      "onclick": "$onFileClick"
    }, "$frame.line"), T.TD({
      "class": "cell-inst"
    }, T.DIV("$frame|getFrameLabel(", T.FOR("arg", "$context,$frame|argIterator", T.DIV({
      "class": "arg",
      "_argNodeObj": "$arg.node",
      "onclick": "$onArgClick",
      "__dbid": "$arg.dbid"
    }, T.TAG("$arg.tag", {
      "node": "$arg.node",
      "context": "$context"
    }), T.IF("$arg.more", T.SPAN({
      "class": "separator"
    }, ",")))), ")"))))))),
    shortTag: T.SPAN({
      "class": "structures-trace"
    }, T.TAG("$context,$node|getCaptionTag", {
      "node": "$node|getCaptionNode"
    })),
    onFileClick: function onFileClick(event) {
      event.stopPropagation();
      var node = event.target.parentNode.frameNodeObj,
          frame = node;

      if (!frame.file || !frame.line) {
        return;
      }

      var args = {
        "file": frame.file.value,
        "line": frame.line.value
      };

      if (args["file"] && args["line"]) {
        domplate.util.dispatchEvent('inspectFile', [event, {
          "message": node.getObjectGraph().message,
          "args": args
        }]);
      }
    },
    onArgClick: function onArgClick(event) {
      event.stopPropagation();
      var tag = event.target;

      while (tag.parentNode) {
        if (tag.argNodeObj) {
          break;
        }

        tag = tag.parentNode;
      }

      domplate.dispatchEvent('inspectNode', [event, {
        "message": tag.argNodeObj.getObjectGraph().message,
        "args": {
          "node": tag.argNodeObj
        }
      }]);
    },
    getCaptionTag: function getCaptionTag(context, node) {
      var rep = context.repForNode(this.getCaptionNode(node));
      return rep.shortTag || rep.tag;
    },
    getCaptionNode: function getCaptionNode(node) {
      return domplate.util.merge(node.value.title, {
        "wrapped": false
      });
    },
    getTrace: function getTrace(node) {
      return node.value.stack;
    },
    postRender: function postRender(node) {
      ;
      debugger;
    },
    getCallList: function getCallList(node) {
      try {
        var list = [];
        this.getTrace(node).forEach(function (node) {
          var frame = node;
          list.push({
            'node': node,
            'file': frame.file ? frame.file : "",
            'line': frame.line ? frame.line : "",
            'class': frame["class"] ? frame["class"] : "",
            'function': frame["function"] ? frame["function"] : "",
            'type': frame.type ? frame.type : "",
            'args': frame.args ? frame.args : false
          });
        });

        try {
          if (list[0].file.substr(0, 1) == '/') {
            var file_shortest = list[0].file.split('/');
            var file_original_length = file_shortest.length;

            for (var i = 1; i < list.length; i++) {
              var file = list[i].file.split('/');

              for (var j = 0; j < file_shortest.length; j++) {
                if (file_shortest[j] != file[j]) {
                  file_shortest.splice(j, file_shortest.length - j);
                  break;
                }
              }
            }

            if (file_shortest.length > 2) {
              if (file_shortest.length == file_original_length) {
                file_shortest.pop();
              }

              file_shortest = file_shortest.join('/');

              for (var i = 0; i < list.length; i++) {
                list[i].file = '...' + list[i].file.substr(file_shortest.length);
              }
            }
          }
        } catch (e) {}

        return list;
      } catch (err) {
        console.error(err);
      }
    },
    getFrameLabel: function getFrameLabel(frame) {
      try {
        if (frame['class']) {
          if (frame['type'] == 'throw') {
            return 'throw ' + frame['class'];
          } else if (frame['type'] == 'trigger') {
            return 'trigger_error';
          } else {
            return frame['class'] + frame['type'] + frame['function'];
          }
        }

        return frame['function'];
      } catch (err) {
        console.error(err);
      }
    },
    argIterator: function argIterator(context, frame) {
      try {
        if (!frame.args) {
          return [];
        }

        var items = [];

        for (var i = 0; i < frame.args.length; i++) {
          var item = {
            "node": domplate.util.merge(frame.args[i], {
              "wrapped": true
            }),
            "tag": context.repForNode(frame.args[i]).shortTag,
            "more": i < frame.args.length - 1
          };

          if (item.tag) {
            item.dbid = item.tag.__dbid;
          }

          items.push(item);
        }

        return items;
      } catch (err) {
        console.error(err);
      }
    }
  };
}

function css() {
  return atob("CltfX2RiaWQ9ImFjY2I0NzNlYmQ5M2U4NGVlMGE3MWJjMjg1OTRhZGM5NzI1ZWRmNDAiXSBTUEFOLnN0cnVjdHVyZXMtdHJhY2UgewogICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKGltYWdlcy9lZGl0LXJ1bGUucG5nKTsKICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7CiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiA0cHggMXB4OwogICAgcGFkZGluZy1sZWZ0OiAyNXB4OwogICAgZm9udC13ZWlnaHQ6IGJvbGQ7Cn0KCltfX2RiaWQ9ImFjY2I0NzNlYmQ5M2U4NGVlMGE3MWJjMjg1OTRhZGM5NzI1ZWRmNDAiXSBESVYuc3RydWN0dXJlcy10cmFjZSB7CiAgICBwYWRkaW5nOiAwcHg7CiAgICBtYXJnaW46IDBweDsKfQoKW19fZGJpZD0iYWNjYjQ3M2ViZDkzZTg0ZWUwYTcxYmMyODU5NGFkYzk3MjVlZGY0MCJdIERJVi5zdHJ1Y3R1cmVzLXRyYWNlIFRBQkxFIHsKICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI0Q3RDdENzsKfQoKW19fZGJpZD0iYWNjYjQ3M2ViZDkzZTg0ZWUwYTcxYmMyODU5NGFkYzk3MjVlZGY0MCJdIERJVi5zdHJ1Y3R1cmVzLXRyYWNlIFRBQkxFIFRCT0RZIFRSIFRILApbX19kYmlkPSJhY2NiNDczZWJkOTNlODRlZTBhNzFiYzI4NTk0YWRjOTcyNWVkZjQwIl0gRElWLnN0cnVjdHVyZXMtdHJhY2UgVEFCTEUgVEJPRFkgVFIgVEQgewogICAgcGFkZGluZzogM3B4OwogICAgcGFkZGluZy1sZWZ0OiAxMHB4OwogICAgcGFkZGluZy1yaWdodDogMTBweDsKfQoKW19fZGJpZD0iYWNjYjQ3M2ViZDkzZTg0ZWUwYTcxYmMyODU5NGFkYzk3MjVlZGY0MCJdIERJVi5zdHJ1Y3R1cmVzLXRyYWNlIFRBQkxFIFRCT0RZIFRSIFRILmhlYWRlci1maWxlIHsKICB3aGl0ZS1zcGFjZTpub3dyYXA7CiAgZm9udC13ZWlnaHQ6IGJvbGQ7CiAgdGV4dC1hbGlnbjogbGVmdDsKfQoKW19fZGJpZD0iYWNjYjQ3M2ViZDkzZTg0ZWUwYTcxYmMyODU5NGFkYzk3MjVlZGY0MCJdIERJVi5zdHJ1Y3R1cmVzLXRyYWNlIFRBQkxFIFRCT0RZIFRSIFRILmhlYWRlci1saW5lIHsKICB3aGl0ZS1zcGFjZTpub3dyYXA7CiAgZm9udC13ZWlnaHQ6IGJvbGQ7CiAgdGV4dC1hbGlnbjogcmlnaHQ7Cn0KW19fZGJpZD0iYWNjYjQ3M2ViZDkzZTg0ZWUwYTcxYmMyODU5NGFkYzk3MjVlZGY0MCJdIERJVi5zdHJ1Y3R1cmVzLXRyYWNlIFRBQkxFIFRCT0RZIFRSIFRILmhlYWRlci1pbnN0IHsKICB3aGl0ZS1zcGFjZTpub3dyYXA7CiAgZm9udC13ZWlnaHQ6IGJvbGQ7CiAgdGV4dC1hbGlnbjogbGVmdDsKfQoKW19fZGJpZD0iYWNjYjQ3M2ViZDkzZTg0ZWUwYTcxYmMyODU5NGFkYzk3MjVlZGY0MCJdIERJVi5zdHJ1Y3R1cmVzLXRyYWNlIFRBQkxFIFRCT0RZIFRSIFRELmNlbGwtZmlsZSB7CiAgdmVydGljYWwtYWxpZ246IHRvcDsKICBib3JkZXI6IDFweCBzb2xpZCAjRDdEN0Q3OwogIGJvcmRlci1ib3R0b206IDBweDsKICBib3JkZXItcmlnaHQ6IDBweDsKfQpbX19kYmlkPSJhY2NiNDczZWJkOTNlODRlZTBhNzFiYzI4NTk0YWRjOTcyNWVkZjQwIl0gRElWLnN0cnVjdHVyZXMtdHJhY2UgVEFCTEUgVEJPRFkgVFIgVEQuY2VsbC1saW5lIHsKICB3aGl0ZS1zcGFjZTpub3dyYXA7CiAgdmVydGljYWwtYWxpZ246IHRvcDsKICB0ZXh0LWFsaWduOiByaWdodDsKICBib3JkZXI6MXB4IHNvbGlkICNEN0Q3RDc7CiAgYm9yZGVyLWJvdHRvbTogMHB4OwogIGJvcmRlci1yaWdodDogMHB4Owp9CltfX2RiaWQ9ImFjY2I0NzNlYmQ5M2U4NGVlMGE3MWJjMjg1OTRhZGM5NzI1ZWRmNDAiXSBESVYuc3RydWN0dXJlcy10cmFjZSBUQUJMRSBUQk9EWSBUUiBURC5jZWxsLWxpbmU6aG92ZXIsCltfX2RiaWQ9ImFjY2I0NzNlYmQ5M2U4NGVlMGE3MWJjMjg1OTRhZGM5NzI1ZWRmNDAiXSBESVYuc3RydWN0dXJlcy10cmFjZSBUQUJMRSBUQk9EWSBUUiBURC5jZWxsLWZpbGU6aG92ZXIgewogICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmYzczZDsKICAgIGN1cnNvcjogcG9pbnRlcjsgICAgCn0KW19fZGJpZD0iYWNjYjQ3M2ViZDkzZTg0ZWUwYTcxYmMyODU5NGFkYzk3MjVlZGY0MCJdIERJVi5zdHJ1Y3R1cmVzLXRyYWNlIFRBQkxFIFRCT0RZIFRSIFRELmNlbGwtaW5zdCB7CiAgdmVydGljYWwtYWxpZ246IHRvcDsKICBwYWRkaW5nLWxlZnQ6IDEwcHg7CiAgZm9udC13ZWlnaHQ6IGJvbGQ7CiAgYm9yZGVyOjFweCBzb2xpZCAjRDdEN0Q3OwogIGJvcmRlci1ib3R0b206IDBweDsKfQoKW19fZGJpZD0iYWNjYjQ3M2ViZDkzZTg0ZWUwYTcxYmMyODU5NGFkYzk3MjVlZGY0MCJdIERJVi5zdHJ1Y3R1cmVzLXRyYWNlIFRBQkxFIFRCT0RZIFRSIFRELmNlbGwtaW5zdCBESVYuYXJnIHsKICBmb250LXdlaWdodDogbm9ybWFsOwogIHBhZGRpbmctbGVmdDogM3B4OwogIHBhZGRpbmctcmlnaHQ6IDNweDsKICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7Cn0KW19fZGJpZD0iYWNjYjQ3M2ViZDkzZTg0ZWUwYTcxYmMyODU5NGFkYzk3MjVlZGY0MCJdIERJVi5zdHJ1Y3R1cmVzLXRyYWNlIFRBQkxFIFRCT0RZIFRSIFRELmNlbGwtaW5zdCBESVYuYXJnOmhvdmVyIHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmM3M2Q7CiAgICBjdXJzb3I6IHBvaW50ZXI7ICAgIAp9CgpbX19kYmlkPSJhY2NiNDczZWJkOTNlODRlZTBhNzFiYzI4NTk0YWRjOTcyNWVkZjQwIl0gRElWLnN0cnVjdHVyZXMtdHJhY2UgVEFCTEUgVEJPRFkgVFIgVEQuY2VsbC1pbnN0IC5zZXBhcmF0b3IgewogICAgcGFkZGluZy1sZWZ0OiAxcHg7CiAgICBwYWRkaW5nLXJpZ2h0OiAzcHg7Cn0K");
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
return (function (root, context, o, d0) {  DomplateDebug.startGroup([' .. Run DOM .. ','div'],arguments);  DomplateDebug.logJs('js','(function (root, context, o, d0) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  var l0 = 0;  var l1 = 0;  var if_0 = 0;  var e0 = 0;  with (this) {      l0 = __loop__.apply(this, [d0, function(i0,l0,d0,d1,d2,d3) {       DomplateDebug.logVar(\'  .. i0 (counterName)\',i0);       DomplateDebug.logVar(\'  .. l0 (loopName)\',l0);        node = __path__(root, o,0,0,0+1+l0+0);node.frameNodeObj = d0;        node = __path__(root, o,0,0,0+1+l0+0,0);node.addEventListener("click", __bind__(this, d1), false);        node = __path__(root, o,0,0,0+1+l0+0,0+1);node.addEventListener("click", __bind__(this, d2), false);      l1 = __loop__.apply(this, [d3, function(i1,l1,d0,d1,d2,d3,d4) {       DomplateDebug.logVar(\'  .. i1 (counterName)\',i1);       DomplateDebug.logVar(\'  .. l1 (loopName)\',l1);        node = __path__(root, o,0,0,0+1+l0+0,0+1+1,0,0+1+l1+0);node.addEventListener("click", __bind__(this, d0), false);node.argNodeObj = d1;        node = __path__(root, o,0,0,0+1+l0+0,0+1+1,0,0+1+l1+0,0);        e0 = __link__(node, d2, d3);      if_0 = __if__.apply(this, [d4, function(if_0) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_0 (ifName)\',if_0);      }]);        return 0+1;      }]);        return 0+1;      }]);  }  DomplateDebug.endGroup();  return 1;})');  var l0 = 0;  var l1 = 0;  var if_0 = 0;  var e0 = 0;  with (this) {      l0 = __loop__.apply(this, [d0, function(i0,l0,d0,d1,d2,d3) {       DomplateDebug.logVar('  .. i0 (counterName)',i0);       DomplateDebug.logVar('  .. l0 (loopName)',l0);        node = __path__(root, o,0,0,0+1+l0+0);node.frameNodeObj = d0;        node = __path__(root, o,0,0,0+1+l0+0,0);node.addEventListener("click", __bind__(this, d1), false);        node = __path__(root, o,0,0,0+1+l0+0,0+1);node.addEventListener("click", __bind__(this, d2), false);      l1 = __loop__.apply(this, [d3, function(i1,l1,d0,d1,d2,d3,d4) {       DomplateDebug.logVar('  .. i1 (counterName)',i1);       DomplateDebug.logVar('  .. l1 (loopName)',l1);        node = __path__(root, o,0,0,0+1+l0+0,0+1+1,0,0+1+l1+0);node.addEventListener("click", __bind__(this, d0), false);node.argNodeObj = d1;        node = __path__(root, o,0,0,0+1+l0+0,0+1+1,0,0+1+l1+0,0);        e0 = __link__(node, d2, d3);      if_0 = __if__.apply(this, [d4, function(if_0) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_0 (ifName)',if_0);      }]);        return 0+1;      }]);        return 0+1;      }]);  }  DomplateDebug.endGroup();  return 1;})
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
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','div'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","structures-trace", " ", "\"",">","<table", " cellpadding=\"","3", "\"", " cellspacing=\"","0", "\"", " class=\"", " ", "\"",">","<tbody", " class=\"", " ", "\"",">","<tr", " class=\"", " ", "\"",">","<th", " class=\"","header-file", " ", "\"",">","File","</th>","<th", " class=\"","header-line", " ", "\"",">","Line","</th>","<th", " class=\"","header-inst", " ", "\"",">","Instruction","</th>","</tr>");    __loop__.apply(this, [getCallList(node), __out__, function(frame, __out__) {    __code__.push("","<tr", " class=\"", " ", "\"",">","<td", " class=\"","cell-file", " ", "\"",">",__escape__(frame.file),"</td>","<td", " class=\"","cell-line", " ", "\"",">",__escape__(frame.line),"</td>","<td", " class=\"","cell-inst", " ", "\"",">","<div", " class=\"", " ", "\"",">",__escape__(getFrameLabel(frame)),"(");__out__.push(frame.node,onFileClick,onFileClick);    __loop__.apply(this, [argIterator(context,frame), __out__, function(arg, __out__) {    __code__.push("","<div", " __dbid=\"",__escape__(arg.dbid), "\"", " class=\"","arg", " ", "\"",">");__out__.push(onArgClick,arg.node);__link__(arg.tag, __code__, __out__, {"node":arg.node,"context":context});__if__.apply(this, [arg.more, __out__, function(__out__) {    __code__.push("","<span", " class=\"","separator", " ", "\"",">",",","</span>");}]);    __code__.push("","</div>");    }]);    __code__.push("",")","</div>","</td>","</tr>");    }]);    __code__.push("","</tbody>","</table>","</div>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","structures-trace", " ", "\"",">","<table", " cellpadding=\"","3", "\"", " cellspacing=\"","0", "\"", " class=\"", " ", "\"",">","<tbody", " class=\"", " ", "\"",">","<tr", " class=\"", " ", "\"",">","<th", " class=\"","header-file", " ", "\"",">","File","</th>","<th", " class=\"","header-line", " ", "\"",">","Line","</th>","<th", " class=\"","header-inst", " ", "\"",">","Instruction","</th>","</tr>");    __loop__.apply(this, [getCallList(node), __out__, function(frame, __out__) {    __code__.push("","<tr", " class=\"", " ", "\"",">","<td", " class=\"","cell-file", " ", "\"",">",__escape__(frame.file),"</td>","<td", " class=\"","cell-line", " ", "\"",">",__escape__(frame.line),"</td>","<td", " class=\"","cell-inst", " ", "\"",">","<div", " class=\"", " ", "\"",">",__escape__(getFrameLabel(frame)),"(");__out__.push(frame.node,onFileClick,onFileClick);    __loop__.apply(this, [argIterator(context,frame), __out__, function(arg, __out__) {    __code__.push("","<div", " __dbid=\"",__escape__(arg.dbid), "\"", " class=\"","arg", " ", "\"",">");__out__.push(onArgClick,arg.node);__link__(arg.tag, __code__, __out__, {"node":arg.node,"context":context});__if__.apply(this, [arg.more, __out__, function(__out__) {    __code__.push("","<span", " class=\"","separator", " ", "\"",">",",","</span>");}]);    __code__.push("","</div>");    }]);    __code__.push("",")","</div>","</td>","</tr>");    }]);    __code__.push("","</tbody>","</table>","</div>");  }DomplateDebug.endGroup();}})
}
,
"shortTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','span'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'span\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<span", " class=\"","structures-trace", " ", "\"",">");__link__(getCaptionTag(context,node), __code__, __out__, {"node":getCaptionNode(node)});    __code__.push("","</span>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<span", " class=\"","structures-trace", " ", "\"",">");__link__(getCaptionTag(context,node), __code__, __out__, {"node":getCaptionNode(node)});    __code__.push("","</span>");  }DomplateDebug.endGroup();}})
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

  rep.__dbid = "accb473ebd93e84ee0a71bc28594adc9725edf40";
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