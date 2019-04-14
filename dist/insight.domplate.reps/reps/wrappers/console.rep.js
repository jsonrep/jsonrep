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
      "class": "summary",
      "__dbid": "$context,$node|_getTagDbid"
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
      console.log("MESSAGE TAG", message);

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
          "valueTag": valueTag,
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
  return atob("CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlIHsKICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsKICAgIG1hcmdpbjogMDsKICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjRDdEN0Q3OwogICAgcGFkZGluZzogMHB4OwogICAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjsKfQpbX19kYmlkPSJkMDM1ZmIzMzhmMWNhM2M5MTEzZTdlMGRiZDdhNTFjZTAyZGI1MTIxIl0gRElWLmNvbnNvbGUtbWVzc2FnZS5zZWxlY3RlZCB7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzVGQzAzICFpbXBvcnRhbnQ7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2UtZ3JvdXBbZXhwYW5kZWQ9dHJ1ZV0gewogICAgYmFja2dyb3VuZC1jb2xvcjogIzc3Q0REOTsKfQpbX19kYmlkPSJkMDM1ZmIzMzhmMWNhM2M5MTEzZTdlMGRiZDdhNTFjZTAyZGI1MTIxIl0gRElWLmNvbnNvbGUtbWVzc2FnZSA+IERJVi5oZWFkZXIgewogICAgcG9zaXRpb246IHJlbGF0aXZlOwogICAgcGFkZGluZy1sZWZ0OiAzNHB4OwogICAgcGFkZGluZy1yaWdodDogMTBweDsKICAgIHBhZGRpbmctdG9wOiAzcHg7CiAgICBwYWRkaW5nLWJvdHRvbTogNHB4OwogICAgY3Vyc29yOiBwb2ludGVyOwp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlW2V4cGFuZGVkPXRydWVdID4gRElWLmhlYWRlciB7CiAgICB0ZXh0LWFsaWduOiByaWdodDsKICAgIG1pbi1oZWlnaHQ6IDE2cHg7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2VbZXhwYW5kZWQ9ZmFsc2VdID4gRElWLmhlYWRlcjpob3ZlciB7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZjNzNkOwp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlLWdyb3VwID4gRElWLmhlYWRlciB7CiAgICBiYWNrZ3JvdW5kOiB1cmwoaW1hZ2VzL2RvY3VtZW50X3BhZ2VfbmV4dC5wbmcpIG5vLXJlcGVhdDsKICAgIGJhY2tncm91bmQtcG9zaXRpb246IDJweCAzcHg7CiAgICBmb250LXdlaWdodDogYm9sZDsKICAgIGJhY2tncm91bmQtY29sb3I6ICM3N0NERDk7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2UgPiBESVYuaGVhZGVyLXByaW9yaXR5LWluZm8gewogICAgYmFja2dyb3VuZDogdXJsKGltYWdlcy9pbmZvcm1hdGlvbi5wbmcpIG5vLXJlcGVhdDsKICAgIGJhY2tncm91bmQtcG9zaXRpb246IDJweCAzcHg7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzZlZWZmOwp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlci1wcmlvcml0eS13YXJuIHsKICAgIGJhY2tncm91bmQ6IHVybChpbWFnZXMvZXhjbGFtYXRpb24tZGlhbW9uZC5wbmcpIG5vLXJlcGVhdDsKICAgIGJhY2tncm91bmQtcG9zaXRpb246IDJweCAzcHg7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZlNjhkOwp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlci1wcmlvcml0eS1lcnJvciB7CiAgICBiYWNrZ3JvdW5kOiB1cmwoaW1hZ2VzL2V4Y2xhbWF0aW9uLXJlZC5wbmcpIG5vLXJlcGVhdDsKICAgIGJhY2tncm91bmQtcG9zaXRpb246IDJweCAzcHg7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZhN2E3Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlciA+IERJVi5leHBhbmRlciB7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjazsKICAgIHdpZHRoOiAxOHB4OwogICAgaGVpZ2h0OiAxOHB4OwogICAgZGlzcGxheTogaW5saW5lLWJsb2NrOwogICAgZmxvYXQ6IGxlZnQ7CiAgICBwb3NpdGlvbjogcmVsYXRpdmU7CiAgICB0b3A6IC0xcHg7CiAgICBtYXJnaW4tbGVmdDogLTE0cHg7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2UgPiBESVYuaGVhZGVyID4gRElWLmV4cGFuZGVyOmhvdmVyIHsKICAgIGN1cnNvcjogcG9pbnRlcjsKfQpbX19kYmlkPSJkMDM1ZmIzMzhmMWNhM2M5MTEzZTdlMGRiZDdhNTFjZTAyZGI1MTIxIl0gRElWLmNvbnNvbGUtbWVzc2FnZVtleHBhbmRlZD1mYWxzZV0gPiBESVYuaGVhZGVyID4gRElWLmV4cGFuZGVyIHsKICAgIGJhY2tncm91bmQ6IHVybChpbWFnZXMvcGx1cy1zbWFsbC13aGl0ZS5wbmcpIG5vLXJlcGVhdDsKICAgIGJhY2tncm91bmQtcG9zaXRpb246IDBweCAxcHg7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2VbZXhwYW5kZWQ9dHJ1ZV0gPiBESVYuaGVhZGVyID4gRElWLmV4cGFuZGVyIHsKICAgIGJhY2tncm91bmQ6IHVybChpbWFnZXMvbWludXMtc21hbGwtd2hpdGUucG5nKSBuby1yZXBlYXQ7CiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwcHggMXB4Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlciA+IFNQQU4uc3VtbWFyeSA+IFNQQU4ubGFiZWwgPiBTUEFOLApbX19kYmlkPSJkMDM1ZmIzMzhmMWNhM2M5MTEzZTdlMGRiZDdhNTFjZTAyZGI1MTIxIl0gRElWLmNvbnNvbGUtbWVzc2FnZSA+IERJVi5oZWFkZXIgPiBTUEFOLmZpbGVsaW5lID4gRElWID4gRElWLmxhYmVsIHsKICAgIG1hcmdpbi1yaWdodDogNXB4OwogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSg2OSw2OCw2MCwxKTsKICAgIHBhZGRpbmctbGVmdDogNXB4OwogICAgcGFkZGluZy1yaWdodDogNXB4OwogICAgY29sb3I6IHdoaXRlOwogICAgdmVydGljYWwtYWxpZ246IHRvcDsKICAgIG1hcmdpbi10b3A6IDFweDsKfQpbX19kYmlkPSJkMDM1ZmIzMzhmMWNhM2M5MTEzZTdlMGRiZDdhNTFjZTAyZGI1MTIxIl0gRElWLmNvbnNvbGUtbWVzc2FnZSA+IERJVi5oZWFkZXIgPiBTUEFOLmZpbGVsaW5lID4gRElWID4gRElWLmxhYmVsIHsKICAgIGZsb2F0OiBsZWZ0OwogICAgbWFyZ2luLXRvcDogMHB4Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlciA+IFNQQU4uc3VtbWFyeSA+IFNQQU4gPiBTUEFOLmNvdW50IHsKICAgIGNvbG9yOiAjOGM4YzhjOwp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlciA+IFNQQU4uZmlsZWxpbmUgewogICAgY29sb3I6ICM4YzhjOGM7CiAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2VbZXhwYW5kZWQ9dHJ1ZV0gPiBESVYuaGVhZGVyID4gU1BBTi5zdW1tYXJ5IHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2Vba2VlcHRpdGxlPXRydWVdID4gRElWLmhlYWRlciwKW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2UtZ3JvdXAgPiBESVYuaGVhZGVyIHsKICAgIHRleHQtYWxpZ246IGxlZnQgIWltcG9ydGFudDsKfQpbX19kYmlkPSJkMDM1ZmIzMzhmMWNhM2M5MTEzZTdlMGRiZDdhNTFjZTAyZGI1MTIxIl0gRElWLmNvbnNvbGUtbWVzc2FnZVtrZWVwdGl0bGU9dHJ1ZV0gPiBESVYuaGVhZGVyID4gU1BBTi5maWxlbGluZSwKW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2UtZ3JvdXAgPiBESVYuaGVhZGVyID4gU1BBTi5maWxlbGluZSB7CiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2Vba2VlcHRpdGxlPXRydWVdID4gRElWLmhlYWRlciA+IFNQQU4uc3VtbWFyeSwKW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2UtZ3JvdXAgPiBESVYuaGVhZGVyID4gU1BBTi5zdW1tYXJ5IHsKICAgIGRpc3BsYXk6IGlubGluZSAhaW1wb3J0YW50Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlLWdyb3VwID4gRElWLmhlYWRlciA+IERJVi5hY3Rpb25zIHsKICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsKfQpbX19kYmlkPSJkMDM1ZmIzMzhmMWNhM2M5MTEzZTdlMGRiZDdhNTFjZTAyZGI1MTIxIl0gRElWLmNvbnNvbGUtbWVzc2FnZS1ncm91cCA+IERJVi5oZWFkZXIgPiBTUEFOLnN1bW1hcnkgPiBTUEFOID4gU1BBTi5jb3VudCB7CiAgICBjb2xvcjogI2ZmZmZmZiAhaW1wb3J0YW50Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlW2V4cGFuZGVkPWZhbHNlXSA+IERJVi5oZWFkZXIgPiBTUEFOLmZpbGVsaW5lIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2UgPiBESVYuaGVhZGVyID4gRElWLmFjdGlvbnMgewogICAgZGlzcGxheTogaW5saW5lLWJsb2NrOwogICAgcG9zaXRpb246IHJlbGF0aXZlOwogICAgdG9wOiAwcHg7CiAgICBsZWZ0OiAxMHB4OwogICAgZmxvYXQ6IHJpZ2h0OwogICAgbWFyZ2luLWxlZnQ6IDBweDsKICAgIG1hcmdpbi1yaWdodDogNXB4Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlciA+IERJVi5hY3Rpb25zIERJVi5pbnNwZWN0IHsKICAgIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICAgIGJhY2tncm91bmQ6IHVybChpbWFnZXMvbm9kZS1tYWduaWZpZXIucG5nKSBuby1yZXBlYXQ7CiAgICB3aWR0aDogMTZweDsKICAgIGhlaWdodDogMTZweDsKICAgIG1hcmdpbi1yaWdodDogNHB4Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlciA+IERJVi5hY3Rpb25zID4gRElWLmZpbGUgewogICAgZGlzcGxheTogaW5saW5lLWJsb2NrOwogICAgYmFja2dyb3VuZDogdXJsKGltYWdlcy9kb2N1bWVudC1iaW5hcnkucG5nKSBuby1yZXBlYXQ7CiAgICB3aWR0aDogMTZweDsKICAgIGhlaWdodDogMTZweDsKICAgIG1hcmdpbi1yaWdodDogNHB4Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlciA+IERJVi5hY3Rpb25zID4gRElWLmluc3BlY3Q6aG92ZXIsCltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmhlYWRlciA+IERJVi5hY3Rpb25zID4gRElWLmZpbGU6aG92ZXIgewogICAgY3Vyc29yOiBwb2ludGVyOwp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmJvZHkgewogICAgcGFkZGluZzogNnB4OwogICAgbWFyZ2luOiAzcHg7CiAgICBtYXJnaW4tdG9wOiAwcHg7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2VbZXhwYW5kZWQ9ZmFsc2VdID4gRElWLmJvZHkgewogICAgZGlzcGxheTogbm9uZTsKfQpbX19kYmlkPSJkMDM1ZmIzMzhmMWNhM2M5MTEzZTdlMGRiZDdhNTFjZTAyZGI1MTIxIl0gRElWLmNvbnNvbGUtbWVzc2FnZS1ncm91cCA+IERJVi5ib2R5IHsKICAgIHBhZGRpbmc6IDBweDsKICAgIG1hcmdpbjogMHB4OwogICAgbWFyZ2luLWxlZnQ6IDIwcHg7CiAgICBib3JkZXItdG9wOiAxcHggc29saWQgIzAwMDAwMDsKICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgIzAwMDAwMDsKICAgIG1hcmdpbi1ib3R0b206IC0xcHg7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2UgPiBESVYuYm9keS1wcmlvcml0eS1pbmZvIHsKICAgIGJvcmRlcjogM3B4IHNvbGlkICNjNmVlZmY7CiAgICBtYXJnaW46IDBweDsKICAgIGJvcmRlci10b3A6IDBweDsKfQpbX19kYmlkPSJkMDM1ZmIzMzhmMWNhM2M5MTEzZTdlMGRiZDdhNTFjZTAyZGI1MTIxIl0gRElWLmNvbnNvbGUtbWVzc2FnZSA+IERJVi5ib2R5LXByaW9yaXR5LXdhcm4gewogICAgYm9yZGVyOiAzcHggc29saWQgI2ZmZTY4ZDsKICAgIG1hcmdpbjogMHB4OwogICAgYm9yZGVyLXRvcDogMHB4Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmJvZHktcHJpb3JpdHktZXJyb3IgewogICAgYm9yZGVyOiAzcHggc29saWQgI2ZmYTdhNzsKICAgIG1hcmdpbjogMHB4OwogICAgYm9yZGVyLXRvcDogMHB4Owp9CltfX2RiaWQ9ImQwMzVmYjMzOGYxY2EzYzkxMTNlN2UwZGJkN2E1MWNlMDJkYjUxMjEiXSBESVYuY29uc29sZS1tZXNzYWdlID4gRElWLmJvZHkgPiBESVYuZ3JvdXAtbm8tbWVzc2FnZXMgewogICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7CiAgICBwYWRkaW5nLWxlZnQ6IDRweDsKICAgIHBhZGRpbmctcmlnaHQ6IDRweDsKICAgIHBhZGRpbmctdG9wOiAzcHg7CiAgICBwYWRkaW5nLWJvdHRvbTogM3B4OwogICAgY29sb3I6IGdyYXk7Cn0KW19fZGJpZD0iZDAzNWZiMzM4ZjFjYTNjOTExM2U3ZTBkYmQ3YTUxY2UwMmRiNTEyMSJdIERJVi5jb25zb2xlLW1lc3NhZ2UgLmhpZGRlbiB7CiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7Cn0K");
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
return (function (root, context, o, d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12) {  DomplateDebug.startGroup([' .. Run DOM .. ','div'],arguments);  DomplateDebug.logJs('js','(function (root, context, o, d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12) {  DomplateDebug.startGroup([\' .. Run DOM .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  var if_0 = 0;  var if_1 = 0;  var e0 = 0;  with (this) {        node = __path__(root, o);node.addEventListener("mouseover", __bind__(this, d0), false);node.addEventListener("mousemove", __bind__(this, d1), false);node.addEventListener("mouseout", __bind__(this, d2), false);node.addEventListener("click", __bind__(this, d3), false);node.messageObject = d4;node.contextObject = d5;node.templateObject = _getTemplateObject(d6);        node = __path__(root, o,0,0+1,0);node.addEventListener("click", __bind__(this, d7), false);        node = __path__(root, o,0,0+1,0+1);node.addEventListener("click", __bind__(this, d8), false);      if_0 = __if__.apply(this, [d9, function(if_0) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_0 (ifName)\',if_0);      }]);        node = __path__(root, o,0,0+1+1,0+1);        e0 = __link__(node, d10, d11);      if_1 = __if__.apply(this, [d12, function(if_1) {       DomplateDebug.logVar(\'  .. d0\',d0);       DomplateDebug.logVar(\'  .. if_1 (ifName)\',if_1);      }]);  }  DomplateDebug.endGroup();  return 1;})');  var if_0 = 0;  var if_1 = 0;  var e0 = 0;  with (this) {        node = __path__(root, o);node.addEventListener("mouseover", __bind__(this, d0), false);node.addEventListener("mousemove", __bind__(this, d1), false);node.addEventListener("mouseout", __bind__(this, d2), false);node.addEventListener("click", __bind__(this, d3), false);node.messageObject = d4;node.contextObject = d5;node.templateObject = _getTemplateObject(d6);        node = __path__(root, o,0,0+1,0);node.addEventListener("click", __bind__(this, d7), false);        node = __path__(root, o,0,0+1,0+1);node.addEventListener("click", __bind__(this, d8), false);      if_0 = __if__.apply(this, [d9, function(if_0) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_0 (ifName)',if_0);      }]);        node = __path__(root, o,0,0+1+1,0+1);        e0 = __link__(node, d10, d11);      if_1 = __if__.apply(this, [d12, function(if_1) {       DomplateDebug.logVar('  .. d0',d0);       DomplateDebug.logVar('  .. if_1 (ifName)',if_1);      }]);  }  DomplateDebug.endGroup();  return 1;})
}
,
"groupNoMessagesTag":function (context) {
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
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','div'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<div", " expandable=\"",__escape__(_isExpandable(node)), "\"", " expanded=\"","false", "\"", " class=\"",__escape__(_getMessageClass(node)), " ", "\"",">","<div", " hideOnExpand=\"",__escape__(_getHideShortTagOnExpand(context,node)), "\"", " class=\"",__escape__(_getHeaderClass(node)), " ", "\"",">","<div", " class=\"","expander", " ", "\"",">","</div>","<div", " class=\"","actions", " ", "\"",">","<div", " class=\"","inspect", " ", "\"",">","</div>","<div", " class=\"","file ",__escape__(_getFileActionClass(node)), " ", "\"",">","</div>","</div>","<span", " __dbid=\"",__escape__(_getTagDbid(context,node)), "\"", " class=\"","summary", " ", "\"",">","<span", " class=\"","label", " ", "\"",">");__out__.push(onMouseOver,onMouseMove,onMouseOut,onClick,node,context,node,onClick,onClick);__if__.apply(this, [_hasLabel(node), __out__, function(__out__) {    __code__.push("","<span", " class=\"", " ", "\"",">",__escape__(_getLabel(node)),"</span>");}]);    __code__.push("","</span>");__link__(_getTag(context,node,CONST_Short), __code__, __out__, {"node":_getValue(context,node),"context":context});    __code__.push("","</span>","<span", " class=\"","fileline", " ", "\"",">","<div", " class=\"", " ", "\"",">");__if__.apply(this, [_hasLabel(node), __out__, function(__out__) {    __code__.push("","<div", " class=\"","label", " ", "\"",">",__escape__(_getLabel(node)),"</div>");}]);    __code__.push("","</div>","<div", " class=\"", " ", "\"",">",__escape__(_getFileLine(node)),"</div>","</span>","</div>","<div", " class=\"",__escape__(_getBodyClass(node)), " ", "\"",">","</div>","</div>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<div", " expandable=\"",__escape__(_isExpandable(node)), "\"", " expanded=\"","false", "\"", " class=\"",__escape__(_getMessageClass(node)), " ", "\"",">","<div", " hideOnExpand=\"",__escape__(_getHideShortTagOnExpand(context,node)), "\"", " class=\"",__escape__(_getHeaderClass(node)), " ", "\"",">","<div", " class=\"","expander", " ", "\"",">","</div>","<div", " class=\"","actions", " ", "\"",">","<div", " class=\"","inspect", " ", "\"",">","</div>","<div", " class=\"","file ",__escape__(_getFileActionClass(node)), " ", "\"",">","</div>","</div>","<span", " __dbid=\"",__escape__(_getTagDbid(context,node)), "\"", " class=\"","summary", " ", "\"",">","<span", " class=\"","label", " ", "\"",">");__out__.push(onMouseOver,onMouseMove,onMouseOut,onClick,node,context,node,onClick,onClick);__if__.apply(this, [_hasLabel(node), __out__, function(__out__) {    __code__.push("","<span", " class=\"", " ", "\"",">",__escape__(_getLabel(node)),"</span>");}]);    __code__.push("","</span>");__link__(_getTag(context,node,CONST_Short), __code__, __out__, {"node":_getValue(context,node),"context":context});    __code__.push("","</span>","<span", " class=\"","fileline", " ", "\"",">","<div", " class=\"", " ", "\"",">");__if__.apply(this, [_hasLabel(node), __out__, function(__out__) {    __code__.push("","<div", " class=\"","label", " ", "\"",">",__escape__(_getLabel(node)),"</div>");}]);    __code__.push("","</div>","<div", " class=\"", " ", "\"",">",__escape__(_getFileLine(node)),"</div>","</span>","</div>","<div", " class=\"",__escape__(_getBodyClass(node)), " ", "\"",">","</div>","</div>");  }DomplateDebug.endGroup();}})
}
,
"groupNoMessagesTag":function (context) {
var DomplateDebug = context.DomplateDebug;
var __escape__ = context.__escape__;
var __if__ = context.__if__;
var __loop__ = context.__loop__;
var __link__ = context.__link__;
return (function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([' .. Run Markup .. ','div'],arguments);  DomplateDebug.logJs('js','(function (__code__, __context__, __in__, __out__) {  DomplateDebug.startGroup([\' .. Run Markup .. \',\'div\'],arguments);  DomplateDebug.logJs(\'js\',\'__SELF__JS__\');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","group-no-messages", " ", "\"",">","No Messages","</div>");  }DomplateDebug.endGroup();}})');  with (this) {  with (__in__) {    __code__.push("","<div", " class=\"","group-no-messages", " ", "\"",">","No Messages","</div>");  }DomplateDebug.endGroup();}})
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

  rep.__dbid = "d035fb338f1ca3c9113e7e0dbd7a51ce02db5121";
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