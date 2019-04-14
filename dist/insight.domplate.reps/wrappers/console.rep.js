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


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function impl(domplate) {
  var T = domplate.tags;
  return {
    CONST_Short: "shortTag",
    tag: T.DIV({
      "class": "$node|_getMessageClass",
      "_messageObject": "$node",
      "_contextObject": "$context",
      "onmouseover": "$onMouseOver",
      "onmousemove": "$onMouseMove",
      "onmouseout": "$onMouseOut",
      "onclick": "$onClick",
      "expandable": "$node|_isExpandable",
      "expanded": "false",
      "_templateObject": "$node|_getTemplateObject"
    }, T.DIV({
      "class": "$node|_getHeaderClass",
      "hideOnExpand": "$context,$node|_getHideShortTagOnExpand"
    }, T.DIV({
      "class": "expander"
    }), T.DIV({
      "class": "actions"
    }, T.DIV({
      "class": "inspect",
      "onclick": "$onClick"
    }), T.DIV({
      "class": "file $node|_getFileActionClass",
      "onclick": "$onClick"
    })), T.SPAN({
      "class": "summary"
    }, T.SPAN({
      "class": "label"
    }, T.IF("$node|_hasLabel", T.SPAN("$node|_getLabel"))), T.TAG("$context,$node,$CONST_Short|_getTag", {
      "node": "$context,$node|_getValue",
      "context": "$context"
    })), T.SPAN({
      "class": "fileline"
    }, T.DIV(T.IF("$node|_hasLabel", T.DIV({
      "class": "label"
    }, "$node|_getLabel"))), T.DIV("$node|_getFileLine"))), T.DIV({
      "class": "$node|_getBodyClass"
    })),
    groupNoMessagesTag: T.DIV({
      "class": "group-no-messages"
    }, "No Messages"),
    _getTemplateObject: function _getTemplateObject() {
      return this;
    },
    _getMessageClass: function _getMessageClass(message) {
      message.postRender = {};

      if (typeof message.meta["group.start"] != "undefined") {
        return "console-message " + "console-message-group";
      } else {
        return "console-message";
      }
    },
    _getHeaderClass: function _getHeaderClass(message) {
      if (!message.meta || !message.meta["priority"]) {
        return "header";
      }

      return "header header-priority-" + message.meta["priority"];
    },
    _getBodyClass: function _getBodyClass(message) {
      if (!message.meta || !message.meta["priority"]) {
        return "body";
      }

      return "body body-priority-" + message.meta["priority"];
    },
    _getFileLine: function _getFileLine(message) {
      if (!message.meta) {
        return "";
      }

      var str = [];

      if (message.meta["file"]) {
        str.push(domplate.util.cropStringLeft(message.meta["file"], 75));
      }

      if (message.meta["line"]) {
        str.push("@");
        str.push(message.meta["line"]);
      }

      return str.join(" ");
    },
    _getHideShortTagOnExpand: function _getHideShortTagOnExpand(context, node) {
      if (typeof node.meta["group.start"] != "undefined") {
        return "false";
      }

      var rep = context.repForNode(node);

      if (rep.VAR_hideShortTagOnExpand === false) {
        return "false";
      }

      if (node.type == "reference") {
        if (node.meta["lang.type"] == "exception") {
          return "false";
        }
      }

      return "true";
    },
    _isExpandable: function _isExpandable(message) {
      return true;
    },
    _getFileActionClass: function _getFileActionClass(message) {
      if (message.meta["file"]) return "";
      return "hidden";
    },
    _getTagDbid: function _getTagDbid(context, node) {
      var rep = context.repForNode(node);
      return rep.__dbid;
    },
    _getTag: function _getTag(context, node, type) {
      var rep = context.repForNode(node);

      if (type == this.CONST_Short) {
        if (rep.shortTag) {
          return rep.shortTag;
        }
      }

      return rep.tag;
    },
    _getRep: function _getRep(message) {
      return message.template;
    },
    _hasLabel: function _hasLabel(message) {
      if (message.meta && typeof message.meta["label"] != "undefined") {
        return true;
      } else {
        return false;
      }
    },
    _getLabel: function _getLabel(message) {
      if (this._hasLabel(message)) {
        return message.meta["label"];
      } else {
        return "";
      }
    },
    _getValue: function _getValue(context, node) {
      if (typeof node.meta["group.start"] != "undefined") {
        node.meta["string.trim.enabled"] = false;
      }

      return node;
    },
    onMouseMove: function onMouseMove(event) {},
    onMouseOver: function onMouseOver(event) {
      if (domplate.util.getChildByClass(this._getMasterRow(event.target), "__no_inspect")) {
        return;
      }
    },
    onMouseOut: function onMouseOut(event) {},
    onClick: function onClick(event) {
      var masterRow = this._getMasterRow(event.target),
          headerTag = domplate.util.getChildByClass(masterRow, "header"),
          actionsTag = domplate.util.getChildByClass(headerTag, "actions"),
          summaryTag = domplate.util.getChildByClass(headerTag, "summary"),
          bodyTag = domplate.util.getChildByClass(masterRow, "body");

      var pointer = {
        x: event.clientX,
        y: event.clientY
      };
      var masterRect = {
        "left": headerTag.getBoundingClientRect().left - 2,
        "top": headerTag.getBoundingClientRect().top - 2,
        "right": actionsTag.getBoundingClientRect().left || headerTag.getBoundingClientRect().right,
        "bottom": headerTag.getBoundingClientRect().bottom + 1
      };

      if (pointer.x >= masterRect.left && pointer.x <= masterRect.right && pointer.y >= masterRect.top && pointer.y <= masterRect.bottom) {
        event.stopPropagation();

        if (masterRow.getAttribute("expanded") == "true") {
          masterRow.setAttribute("expanded", "false");
          masterRow.contextObject.dispatchEvent('contract', [event, {
            "message": masterRow.messageObject,
            "masterTag": masterRow,
            "summaryTag": summaryTag,
            "bodyTag": bodyTag
          }]);
        } else {
          masterRow.setAttribute("expanded", "true");
          masterRow.contextObject.dispatchEvent('expand', [event, {
            "message": masterRow.messageObject,
            "masterTag": masterRow,
            "summaryTag": summaryTag,
            "bodyTag": bodyTag
          }]);

          if (!bodyTag.innerHTML) {
            if (typeof masterRow.messageObject.meta["group.start"] != "undefined") {
              this.groupNoMessagesTag.replace({}, bodyTag, this);
            } else {
              this.expandForMasterRow(masterRow, bodyTag);
            }

            this.postRender(bodyTag);
          }
        }
      } else if (domplate.util.hasClass(event.target, "inspect")) {
        event.stopPropagation();
        masterRow.contextObject.dispatchEvent('inspectMessage', [event, {
          "message": masterRow.messageObject,
          "masterTag": masterRow,
          "summaryTag": summaryTag,
          "bodyTag": bodyTag,
          "args": {
            "node": masterRow.messageObject
          }
        }]);
      } else if (domplate.util.hasClass(event.target, "file")) {
        event.stopPropagation();
        var args = {
          "file": masterRow.messageObject.meta.file,
          "line": masterRow.messageObject.meta.line
        };

        if (args["file"] && args["line"]) {
          masterRow.contextObject.dispatchEvent('inspectFile', [event, {
            "message": masterRow.messageObject,
            "masterTag": masterRow,
            "summaryTag": summaryTag,
            "bodyTag": bodyTag,
            "args": args
          }]);
        }
      } else {
        event.stopPropagation();
        masterRow.contextObject.dispatchEvent('click', [event, {
          "message": masterRow.messageObject,
          "masterTag": masterRow,
          "bodyTag": bodyTag
        }]);
      }
    },
    setCount: function setCount(node, count) {
      try {
        var masterRow = this._getMasterRow(node),
            headerTag = domplate.util.getChildByClass(masterRow, "header"),
            summaryTag = domplate.util.getChildByClass(headerTag, "summary");

        summaryTag.children[1].innerHTML += ' <span class="count">(' + count + ')</span>';
      } catch (e) {
        helpers.logger.error("Error setting count for node!: " + e);
      }
    },
    postRender: function postRender(node) {
      var node = this._getMasterRow(node);

      if (node.messageObject && _typeof(node.messageObject.postRender) == "object") {
        if (typeof node.messageObject.postRender.keeptitle !== "undefined") {
          node.setAttribute("keeptitle", node.messageObject.postRender.keeptitle ? "true" : "false");
        }
      }
    },
    expandForMasterRow: function expandForMasterRow(masterRow, bodyTag) {
      masterRow.setAttribute("expanded", "true");
      var rep = masterRow.contextObject.repForNode(masterRow.messageObject);
      rep.tag.replace({
        "node": masterRow.messageObject,
        "context": masterRow.contextObject
      }, bodyTag, rep);
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
  return atob("CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gewogICAgcG9zaXRpb246IHJlbGF0aXZlOwogICAgbWFyZ2luOiAwOwogICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNEN0Q3RDc7CiAgICBwYWRkaW5nOiAwcHg7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGOwp9CkRJVi5jb25zb2xlLW1lc3NhZ2Uuc2VsZWN0ZWRbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gewogICAgYmFja2dyb3VuZC1jb2xvcjogIzM1RkMwMyAhaW1wb3J0YW50Owp9CkRJVi5jb25zb2xlLW1lc3NhZ2UtZ3JvdXBbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl1bZXhwYW5kZWQ9dHJ1ZV0gewogICAgYmFja2dyb3VuZC1jb2xvcjogIzc3Q0REOTsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmhlYWRlciB7CiAgICBwb3NpdGlvbjogcmVsYXRpdmU7CiAgICBwYWRkaW5nLWxlZnQ6IDM0cHg7CiAgICBwYWRkaW5nLXJpZ2h0OiAxMHB4OwogICAgcGFkZGluZy10b3A6IDNweDsKICAgIHBhZGRpbmctYm90dG9tOiA0cHg7CiAgICBjdXJzb3I6IHBvaW50ZXI7Cn0KRElWLmNvbnNvbGUtbWVzc2FnZVtfX2RiaWQ9ImNkZDQ5NDlkMTVkZGExMTlkNTRlYzc2YTc5ZmNkMDVhNjUwODY1NmUiXVtleHBhbmRlZD10cnVlXSA+IERJVi5oZWFkZXIgewogICAgdGV4dC1hbGlnbjogcmlnaHQ7CiAgICBtaW4taGVpZ2h0OiAxNnB4Owp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl1bZXhwYW5kZWQ9ZmFsc2VdID4gRElWLmhlYWRlcjpob3ZlciB7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZjNzNkOwp9CkRJVi5jb25zb2xlLW1lc3NhZ2UtZ3JvdXBbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gPiBESVYuaGVhZGVyIHsKICAgIGJhY2tncm91bmQ6IHVybChpbWFnZXMvZG9jdW1lbnRfcGFnZV9uZXh0LnBuZykgbm8tcmVwZWF0OwogICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMnB4IDNweDsKICAgIGZvbnQtd2VpZ2h0OiBib2xkOwogICAgYmFja2dyb3VuZC1jb2xvcjogIzc3Q0REOTsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmhlYWRlci1wcmlvcml0eS1pbmZvIHsKICAgIGJhY2tncm91bmQ6IHVybChpbWFnZXMvaW5mb3JtYXRpb24ucG5nKSBuby1yZXBlYXQ7CiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAycHggM3B4OwogICAgYmFja2dyb3VuZC1jb2xvcjogI2M2ZWVmZjsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmhlYWRlci1wcmlvcml0eS13YXJuIHsKICAgIGJhY2tncm91bmQ6IHVybChpbWFnZXMvZXhjbGFtYXRpb24tZGlhbW9uZC5wbmcpIG5vLXJlcGVhdDsKICAgIGJhY2tncm91bmQtcG9zaXRpb246IDJweCAzcHg7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZlNjhkOwp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gPiBESVYuaGVhZGVyLXByaW9yaXR5LWVycm9yIHsKICAgIGJhY2tncm91bmQ6IHVybChpbWFnZXMvZXhjbGFtYXRpb24tcmVkLnBuZykgbm8tcmVwZWF0OwogICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMnB4IDNweDsKICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmE3YTc7Cn0KRElWLmNvbnNvbGUtbWVzc2FnZVtfX2RiaWQ9ImNkZDQ5NDlkMTVkZGExMTlkNTRlYzc2YTc5ZmNkMDVhNjUwODY1NmUiXSA+IERJVi5oZWFkZXIgPiBESVYuZXhwYW5kZXIgewogICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7CiAgICB3aWR0aDogMThweDsKICAgIGhlaWdodDogMThweDsKICAgIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICAgIGZsb2F0OiBsZWZ0OwogICAgcG9zaXRpb246IHJlbGF0aXZlOwogICAgdG9wOiAtMXB4OwogICAgbWFyZ2luLWxlZnQ6IC0xNHB4Owp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gPiBESVYuaGVhZGVyID4gRElWLmV4cGFuZGVyOmhvdmVyIHsKICAgIGN1cnNvcjogcG9pbnRlcjsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdW2V4cGFuZGVkPWZhbHNlXSA+IERJVi5oZWFkZXIgPiBESVYuZXhwYW5kZXIgewogICAgYmFja2dyb3VuZDogdXJsKGltYWdlcy9wbHVzLXNtYWxsLXdoaXRlLnBuZykgbm8tcmVwZWF0OwogICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMHB4IDFweDsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdW2V4cGFuZGVkPXRydWVdID4gRElWLmhlYWRlciA+IERJVi5leHBhbmRlciB7CiAgICBiYWNrZ3JvdW5kOiB1cmwoaW1hZ2VzL21pbnVzLXNtYWxsLXdoaXRlLnBuZykgbm8tcmVwZWF0OwogICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMHB4IDFweDsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmhlYWRlciA+IFNQQU4uc3VtbWFyeSA+IFNQQU4ubGFiZWwgPiBTUEFOLCBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlciA+IFNQQU4uZmlsZWxpbmUgPiBESVYgPiBESVYubGFiZWwgewogICAgbWFyZ2luLXJpZ2h0OiA1cHg7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDY5LDY4LDYwLDEpOwogICAgcGFkZGluZy1sZWZ0OiA1cHg7CiAgICBwYWRkaW5nLXJpZ2h0OiA1cHg7CiAgICBjb2xvcjogd2hpdGU7CiAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wOwogICAgbWFyZ2luLXRvcDogMXB4Owp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gPiBESVYuaGVhZGVyID4gU1BBTi5maWxlbGluZSA+IERJViA+IERJVi5sYWJlbCB7CiAgICBmbG9hdDogbGVmdDsKICAgIG1hcmdpbi10b3A6IDBweDsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmhlYWRlciA+IFNQQU4uc3VtbWFyeSA+IFNQQU4gPiBTUEFOLmNvdW50IHsKICAgIGNvbG9yOiAjOGM4YzhjOwp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gPiBESVYuaGVhZGVyID4gU1BBTi5maWxlbGluZSB7CiAgICBjb2xvcjogIzhjOGM4YzsKICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdW2V4cGFuZGVkPXRydWVdID4gRElWLmhlYWRlciA+IFNQQU4uc3VtbWFyeSB7CiAgICBkaXNwbGF5OiBub25lOwp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl1ba2VlcHRpdGxlPXRydWVdID4gRElWLmhlYWRlciwgRElWLmNvbnNvbGUtbWVzc2FnZS1ncm91cCA+IERJVi5oZWFkZXIgewogICAgdGV4dC1hbGlnbjogbGVmdCAhaW1wb3J0YW50Owp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl1ba2VlcHRpdGxlPXRydWVdID4gRElWLmhlYWRlciA+IFNQQU4uZmlsZWxpbmUsIERJVi5jb25zb2xlLW1lc3NhZ2UtZ3JvdXAgPiBESVYuaGVhZGVyID4gU1BBTi5maWxlbGluZSB7CiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7Cn0KRElWLmNvbnNvbGUtbWVzc2FnZVtfX2RiaWQ9ImNkZDQ5NDlkMTVkZGExMTlkNTRlYzc2YTc5ZmNkMDVhNjUwODY1NmUiXVtrZWVwdGl0bGU9dHJ1ZV0gPiBESVYuaGVhZGVyID4gU1BBTi5zdW1tYXJ5LCBESVYuY29uc29sZS1tZXNzYWdlLWdyb3VwID4gRElWLmhlYWRlciA+IFNQQU4uc3VtbWFyeSB7CiAgICBkaXNwbGF5OiBpbmxpbmUgIWltcG9ydGFudDsKfQpESVYuY29uc29sZS1tZXNzYWdlLWdyb3VwW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmhlYWRlciA+IERJVi5hY3Rpb25zIHsKICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsKfQpESVYuY29uc29sZS1tZXNzYWdlLWdyb3VwW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmhlYWRlciA+IFNQQU4uc3VtbWFyeSA+IFNQQU4gPiBTUEFOLmNvdW50IHsKICAgIGNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7Cn0KRElWLmNvbnNvbGUtbWVzc2FnZVtfX2RiaWQ9ImNkZDQ5NDlkMTVkZGExMTlkNTRlYzc2YTc5ZmNkMDVhNjUwODY1NmUiXVtleHBhbmRlZD1mYWxzZV0gPiBESVYuaGVhZGVyID4gU1BBTi5maWxlbGluZSB7CiAgICBkaXNwbGF5OiBub25lOwp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gPiBESVYuaGVhZGVyID4gRElWLmFjdGlvbnMgewogICAgZGlzcGxheTogaW5saW5lLWJsb2NrOwogICAgcG9zaXRpb246IHJlbGF0aXZlOwogICAgdG9wOiAwcHg7CiAgICBsZWZ0OiAxMHB4OwogICAgZmxvYXQ6IHJpZ2h0OwogICAgbWFyZ2luLWxlZnQ6IDBweDsKICAgIG1hcmdpbi1yaWdodDogNXB4Owp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gPiBESVYuaGVhZGVyID4gRElWLmFjdGlvbnMgRElWLmluc3BlY3QgewogICAgZGlzcGxheTogaW5saW5lLWJsb2NrOwogICAgYmFja2dyb3VuZDogdXJsKGltYWdlcy9ub2RlLW1hZ25pZmllci5wbmcpIG5vLXJlcGVhdDsKICAgIHdpZHRoOiAxNnB4OwogICAgaGVpZ2h0OiAxNnB4OwogICAgbWFyZ2luLXJpZ2h0OiA0cHg7Cn0KRElWLmNvbnNvbGUtbWVzc2FnZVtfX2RiaWQ9ImNkZDQ5NDlkMTVkZGExMTlkNTRlYzc2YTc5ZmNkMDVhNjUwODY1NmUiXSA+IERJVi5oZWFkZXIgPiBESVYuYWN0aW9ucyA+IERJVi5maWxlIHsKICAgIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICAgIGJhY2tncm91bmQ6IHVybChpbWFnZXMvZG9jdW1lbnQtYmluYXJ5LnBuZykgbm8tcmVwZWF0OwogICAgd2lkdGg6IDE2cHg7CiAgICBoZWlnaHQ6IDE2cHg7CiAgICBtYXJnaW4tcmlnaHQ6IDRweDsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmhlYWRlciA+IERJVi5hY3Rpb25zID4gRElWLmluc3BlY3Q6aG92ZXIsIERJVi5jb25zb2xlLW1lc3NhZ2UgPiBESVYuaGVhZGVyID4gRElWLmFjdGlvbnMgPiBESVYuZmlsZTpob3ZlciB7CiAgICBjdXJzb3I6IHBvaW50ZXI7Cn0KRElWLmNvbnNvbGUtbWVzc2FnZVtfX2RiaWQ9ImNkZDQ5NDlkMTVkZGExMTlkNTRlYzc2YTc5ZmNkMDVhNjUwODY1NmUiXSA+IERJVi5ib2R5IHsKICAgIHBhZGRpbmc6IDZweDsKICAgIG1hcmdpbjogM3B4OwogICAgbWFyZ2luLXRvcDogMHB4Owp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl1bZXhwYW5kZWQ9ZmFsc2VdID4gRElWLmJvZHkgewogICAgZGlzcGxheTogbm9uZTsKfQpESVYuY29uc29sZS1tZXNzYWdlLWdyb3VwW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmJvZHkgewogICAgcGFkZGluZzogMHB4OwogICAgbWFyZ2luOiAwcHg7CiAgICBtYXJnaW4tbGVmdDogMjBweDsKICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjMDAwMDAwOwogICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjMDAwMDAwOwogICAgbWFyZ2luLWJvdHRvbTogLTFweDsKfQpESVYuY29uc29sZS1tZXNzYWdlW19fZGJpZD0iY2RkNDk0OWQxNWRkYTExOWQ1NGVjNzZhNzlmY2QwNWE2NTA4NjU2ZSJdID4gRElWLmJvZHktcHJpb3JpdHktaW5mbyB7CiAgICBib3JkZXI6IDNweCBzb2xpZCAjYzZlZWZmOwogICAgbWFyZ2luOiAwcHg7CiAgICBib3JkZXItdG9wOiAwcHg7Cn0KRElWLmNvbnNvbGUtbWVzc2FnZVtfX2RiaWQ9ImNkZDQ5NDlkMTVkZGExMTlkNTRlYzc2YTc5ZmNkMDVhNjUwODY1NmUiXSA+IERJVi5ib2R5LXByaW9yaXR5LXdhcm4gewogICAgYm9yZGVyOiAzcHggc29saWQgI2ZmZTY4ZDsKICAgIG1hcmdpbjogMHB4OwogICAgYm9yZGVyLXRvcDogMHB4Owp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gPiBESVYuYm9keS1wcmlvcml0eS1lcnJvciB7CiAgICBib3JkZXI6IDNweCBzb2xpZCAjZmZhN2E3OwogICAgbWFyZ2luOiAwcHg7CiAgICBib3JkZXItdG9wOiAwcHg7Cn0KRElWLmNvbnNvbGUtbWVzc2FnZVtfX2RiaWQ9ImNkZDQ5NDlkMTVkZGExMTlkNTRlYzc2YTc5ZmNkMDVhNjUwODY1NmUiXSA+IERJVi5ib2R5ID4gRElWLmdyb3VwLW5vLW1lc3NhZ2VzIHsKICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlOwogICAgcGFkZGluZy1sZWZ0OiA0cHg7CiAgICBwYWRkaW5nLXJpZ2h0OiA0cHg7CiAgICBwYWRkaW5nLXRvcDogM3B4OwogICAgcGFkZGluZy1ib3R0b206IDNweDsKICAgIGNvbG9yOiBncmF5Owp9CkRJVi5jb25zb2xlLW1lc3NhZ2VbX19kYmlkPSJjZGQ0OTQ5ZDE1ZGRhMTE5ZDU0ZWM3NmE3OWZjZDA1YTY1MDg2NTZlIl0gLmhpZGRlbiB7CiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7Cn0K");
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
return (function (root, context, o, d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12) {  var if_0 = 0;  var if_1 = 0;  var e0 = 0;  with (this) {        node = __path__(root, o);node.addEventListener("mouseover", __bind__(this, d0), false);node.addEventListener("mousemove", __bind__(this, d1), false);node.addEventListener("mouseout", __bind__(this, d2), false);node.addEventListener("click", __bind__(this, d3), false);node.messageObject = d4;node.contextObject = d5;node.templateObject = _getTemplateObject(d6);        node = __path__(root, o,0,0+1,0);node.addEventListener("click", __bind__(this, d7), false);        node = __path__(root, o,0,0+1,0+1);node.addEventListener("click", __bind__(this, d8), false);      if_0 = __if__.apply(this, [d9, function(if_0) {      }]);        node = __path__(root, o,0,0+1+1,0+1);        e0 = __link__(node, d10, d11);      if_1 = __if__.apply(this, [d12, function(if_1) {      }]);  }  return 1;})
}
,
"groupNoMessagesTag":function (context) {
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
return (function (__code__, __context__, __in__, __out__) {  with (this) {  with (__in__) {    __code__.push("","<div", " expandable=\"",__escape__(_isExpandable(node)), "\"", " expanded=\"","false", "\"", " __dbid=\"","cdd4949d15dda119d54ec76a79fcd05a6508656e", "\"", " __dtid=\"","insight.domplate.reps/wrappers/console", "\"", " class=\"",__escape__(_getMessageClass(node)), " ", "\"",">","<div", " hideOnExpand=\"",__escape__(_getHideShortTagOnExpand(context,node)), "\"", " class=\"",__escape__(_getHeaderClass(node)), " ", "\"",">","<div", " class=\"","expander", " ", "\"",">","</div>","<div", " class=\"","actions", " ", "\"",">","<div", " class=\"","inspect", " ", "\"",">","</div>","<div", " class=\"","file ",__escape__(_getFileActionClass(node)), " ", "\"",">","</div>","</div>","<span", " class=\"","summary", " ", "\"",">","<span", " class=\"","label", " ", "\"",">");__out__.push(onMouseOver,onMouseMove,onMouseOut,onClick,node,context,node,onClick,onClick);__if__.apply(this, [_hasLabel(node), __out__, function(__out__) {    __code__.push("","<span",">",__escape__(_getLabel(node)),"</span>");}]);    __code__.push("","</span>");__link__(_getTag(context,node,CONST_Short), __code__, __out__, {"node":_getValue(context,node),"context":context});    __code__.push("","</span>","<span", " class=\"","fileline", " ", "\"",">","<div",">");__if__.apply(this, [_hasLabel(node), __out__, function(__out__) {    __code__.push("","<div", " class=\"","label", " ", "\"",">",__escape__(_getLabel(node)),"</div>");}]);    __code__.push("","</div>","<div",">",__escape__(_getFileLine(node)),"</div>","</span>","</div>","<div", " class=\"",__escape__(_getBodyClass(node)), " ", "\"",">","</div>","</div>");  }}})
}
,
"groupNoMessagesTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  with (this) {  with (__in__) {    __code__.push("","<div", " __dbid=\"","cdd4949d15dda119d54ec76a79fcd05a6508656e", "\"", " __dtid=\"","insight.domplate.reps/wrappers/console", "\"", " class=\"","group-no-messages", " ", "\"",">","No Messages","</div>");  }}})
}
};
  rep.__dbid = "cdd4949d15dda119d54ec76a79fcd05a6508656e";
  rep.__dtid = "insight.domplate.reps/wrappers/console";
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