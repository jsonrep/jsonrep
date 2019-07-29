
exports.main = async function (JSONREP, node) {

    function makeAttributes () {
        var attributes = {};
        if (node.style) {
            attributes.style = Object.keys(node.style).map(function (name) {
                return name + ':' + node.style[name];
            }).join(";");
        }
        return Object.keys(attributes).map(function (name) {
            return name + '="' + attributes[name].replace(/"/g, '\\"') + '"';
        }).join(" ");
    }

    const html = await JSONREP.markupNode(node.innerHTML);

    return ('<div ' + makeAttributes() + '>' + html + '</div>');
}
