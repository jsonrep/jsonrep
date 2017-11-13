
const RIOT = require("riot");



exports.processSync = function (codeblock) {

    var js = RIOT.compile([
        '<tag>',
        codeblock.getCode(),
        '</tag>'
    ].join("\n"), {});
    
    return [
        'function (context) {',
            'return {',
                'html: "<div></div>",',
                '"on": {',
                    '"mount":' + ((function (el) {

                        riot.tag('raw', '<div></div>', function(opts) {                                                                                                                                                                                                                            
                            this.set = function () { this.root.childNodes[0].innerHTML = opts.html }                                                                                                                                                                                                                           
                            this.on('update', this.set)                                                                                                                                                                
                            this.on('mount', this.set)                                                                                                                                                                 
                        });
                        
                        "%%JS%%"
                                            
                        riot.mount(el, 'tag', context);

                    }).toString()
                        .replace(/"%%JS%%"/, js)),
                '}',
            '};',
        '}'
    ].join("\n");
}
