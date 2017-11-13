
const RIOT = require("riot");
const CRYPTO = require("crypto");


exports.processSync = function (codeblock) {

    var code = codeblock.getCode();

    var id = CRYPTO.createHash('sha1').update(code).digest('hex');

    var js = RIOT.compile([
        '<tag_' + id + '>',
        code,
        '</tag_' + id + '>'
    ].join("\n"), {});
    
    return [
        'function (context) {',
            'return {',
                'html: "<div></div>",',
                '"on": {',
                    '"mount":' + ((function (el) {

//                        debugger;
                        riot.util.styleManager.add = function (cssText, name) {
//console.log("ADD", cssText, name);

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
//console.log("INJECT");
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
                        .replace(/"%%JS%%"/, js)),
                '}',
            '};',
        '}'
    ].join("\n");
}
