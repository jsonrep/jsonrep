
const RIOT = require("riot");
const CRYPTO = require("crypto");


exports.processSync = function (codeblock, options) {

    var result = {};

    var code = codeblock.getCode();

    var id = CRYPTO.createHash('sha1').update(code).digest('hex');

    if (options.CONFIG.externalizeCss) {
        var styleCodeMatch = code.match(/<style>([\s\S]+)<\/style>/);
        if (styleCodeMatch) {
            code = code.replace(styleCodeMatch[0], '');

            const POSTCSS = require("postcss");
            result.css = POSTCSS([
                POSTCSS.plugin('scope-selectors-plugin', function (opts) {
                    opts = opts || {};
                    // Work with options here
                    return function (root, result) {
                        root.walkRules(function(rule) {
                            // We'll put more code here in a moment…
                            rule.selector = rule.selector.replace(/[\n\s\t]+/g, ' ').replace(/(^\s|\s$)/g, '').replace(/^:scope\s*/, '');
                            var selectors = rule.selector.split(',');
                            selectors = selectors.map(function (selector) {
                                return selector.replace(/^([A-Za-z0-9_\-\.]*)(\[.+\])?(:.+)?(\s.+)?$/, '$1[data-is="tag_' + id + '"]$2$3$4');
                            });
                            rule.selector = selectors.join(',');
                        });                                                    
                        // Transform CSS AST here
                    };
                })
            ]).process(styleCodeMatch[1]).css;
        }
    }

    var js = RIOT.compile([
        '<tag_' + id + '>',
        code,
        '</tag_' + id + '>'
    ].join("\n"), {});

    result.code = `
        function (context, options) {
            var JSONREP = this;
            return {
                html: "<div></div>",
                "on": {
                    "mount":${((function (el) {

                        riot.util.styleManager.add = function (cssText, name) {
                            if (!cssText) {
                                return;
                            }

                            console.log("[jsonrep][riot] Inject cssText:", cssText);  

                            if (window.document.createStyleSheet) {
                                var sheet = window.document.createStyleSheet();
                                sheet.cssText = cssText;
                            } else {
                                var style = window.document.createElementNS ?
                                            window.document.createElementNS("http://www.w3.org/1999/xhtml", "style") :
                                            window.document.createElement("style");
                                style.appendChild(window.document.createTextNode(cssText));
                                var head = window.document.getElementsByTagName("head")[0] || window.document.documentElement;
                                head.appendChild(style);
                            }
                        }
                        riot.util.styleManager.inject = function () {
                            if (!options) return;
                            // TODO: Error tracking
                            JSONREP.loadStyle(options.renderer.uri + '.css');
                        }

                        riot.tag('raw', '<div></div>', function(opts) {                                                                                                                                                                                                                            
                            this.set = function () { this.root.childNodes[0].innerHTML = opts.html }                                                                                                                                                                                                                           
                            this.on('update', this.set)                                                                                                                                                                
                            this.on('mount', this.set)                                                                                                                                                                 
                        });

                        "%%JS%%"

                        riot.mount(el, 'tag_%%ID%%', context);

                    }).toString()
                        .replace(/%%ID%%/, id)
                        .replace(/"%%JS%%"/, js)
                        .replace(/%%URI%%/, options.uri))}
                }
            };
        }
    `;

    return result;
}
