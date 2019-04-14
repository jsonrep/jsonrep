((function (_require, _exports, _module) {
var bundle = { require: _require, exports: _exports, module: _module };
var exports = undefined;
var module = undefined;
var define = function (deps, init) {
var exports = init();
[["insight-domplate-renderer","Renderer"]].forEach(function (expose) {
if (typeof window !== "undefined") {
window[expose[0]] = exports[expose[1]];
} else if (typeof self !== "undefined") {
self[expose[0]] = exports[expose[1]];
}
});
}; define.amd = true;

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mainModule = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var WINDOW = window;
var DOMPLATE = WINDOW.domplate;

function Renderer(options) {
  var self = this;

  if (!options.repsBaseUrl) {
    throw new Error("'options.repsBaseUrl' not set!");
  }

  var loadingReps = {};
  var loadedReps = {};

  function ensureRepForUri(repUri) {
    if (!loadingReps[repUri]) {
      loadingReps[repUri] = new WINDOW.Promise(function (resolve, reject) {
        var url = options.repsBaseUrl + "/" + repUri;
        DOMPLATE.loadRep(url, {
          cssBaseUrl: options.repsBaseUrl.replace(/\/?$/, "/") + repUri.replace(/^([^\/]+\/).+$/, "$1")
        }, function (rep) {
          resolve(rep);
        }, function (err) {
          var error = new Error("Error loading rep for uri '" + repUri + "' from '" + url + "'!");
          error.previous = err;
          reject(error);
        });
      });
    }

    return loadingReps[repUri];
  }

  function repUriForType(lang, type) {
    type = type || "unknown";
    return lang + "/" + type;
  }

  function repUriForNode(node) {
    var lang = "default";
    var type = node.type;

    if (node.meta) {
      if (node.meta["encoder.trimmed"]) {
        type = "trimmed";
      } else if (node.meta.renderer === "structures/table") {
          type = "table";
        } else if (node.meta.renderer === "structures/trace") {
            type = "trace";
          } else if (node.meta["lang"] && node.meta["lang.type"]) {
            lang = node.meta["lang"];
            type = node.meta["lang.type"];

            if (lang === "php") {
              if (type === "array") {
                if (node.value[0] && Array.isArray(node.value[0])) {
                  type = "array-associative";
                } else {
                  type = "array-indexed";
                }
              }
            }
          }
    }

    return repUriForType(lang, type);
  }

  function InsightDomplateContext() {
    var self = this;

    self.repForNode = function (node) {
      var repUri = repUriForNode(node);

      if (!loadedReps[repUri]) {
        throw new Error("Rep for uri '" + repUri + "' not loaded!");
      }

      return loadedReps[repUri];
    };
  }

  var context = new InsightDomplateContext();

  function ensureRepsForNodeLoaded(node) {
    var loadTypes = {};

    function traverse(node) {
      if (node.type) {
        loadTypes["default/" + node.type] = true;
      }

      if (node.meta) {
        if (node.meta["encoder.trimmed"]) {
          loadTypes["default/trimmed"] = true;
        } else if (node.meta.renderer === "structures/table") {
            loadTypes["default/table"] = true;
            node.type = "table";
          } else if (node.meta.renderer === "structures/trace") {
              loadTypes["default/trace"] = true;
              node.type = "trace";
            } else if (node.meta["lang"] && node.meta["lang.type"]) {
              if (node.meta["lang"] === "php" && node.meta["lang.type"] === "array") {
                if (node.value[0] && Array.isArray(node.value[0])) {
                  loadTypes["php/array-associative"] = true;
                  node.value.forEach(function (pair) {
                    traverse(pair[0]);
                    traverse(pair[1]);
                  });
                } else {
                  loadTypes["php/array-indexed"] = true;
                  node.value.forEach(function (node) {
                    traverse(node);
                  });
                }
              } else {
                loadTypes[node.meta["lang"] + "/" + node.meta["lang.type"]] = true;
              }
            }
      }

      if (node.value) {
        if (node.type === "array") {
          node.value.forEach(function (node) {
            traverse(node);
          });
        } else if (node.type === "dictionary") {
          Object.keys(node.value).forEach(function (key) {
            traverse(node.value[key]);
          });
        } else if (node.type === "map") {
          node.value.forEach(function (pair) {
            traverse(pair[0]);
            traverse(pair[1]);
          });
        } else if (node.type === "reference") {
          if (node.value.instance) {
            traverse(node.value.instance);
          }
        } else if (node.type === "table") {
          if (node.value.title) {
            traverse(node.value.title);
          }

          if (node.value.header) {
            node.value.header.forEach(function (node) {
              traverse(node);
            });
          }

          if (node.value.body) {
            node.value.body.forEach(function (row) {
              row.forEach(function (cell) {
                traverse(cell);
              });
            });
          }
        } else if (node.type === "trace") {
          if (node.value.title) {
            traverse(node.value.title);
          }

          if (node.value.stack) {
            node.value.stack.forEach(function (frame) {
              frame.args.forEach(function (arg) {
                traverse(arg);
              });
            });
          }
        }
      }
    }

    traverse(node);
    return Promise.all(Object.keys(loadTypes).map(function (type) {
      type = type.split("/");
      var repUri = repUriForType(type[0], type[1]);
      return ensureRepForUri(repUri).then(function (rep) {
        loadedReps[repUri] = rep;
        return null;
      });
    }));
  }

  self.renderNodeInto = function (node, selector) {
    var el = document.querySelector(selector);

    if (!el) {
      throw new Error("Could not find element for selector '" + selector + "'!");
    }

    return ensureRepsForNodeLoaded(node).then(function () {
      var rep = context.repForNode(node);
      rep.tag.replace({
        context: context,
        node: node
      }, el);
    });
  };
}

exports.Renderer = Renderer;
},{}]},{},[1])(1)
});

})((typeof require !== "undefined" && require) || undefined, (typeof exports !== "undefined" && exports) || undefined, (typeof module !== "undefined" && module) || undefined))