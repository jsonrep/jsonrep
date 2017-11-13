
exports.main = function (JSONREP, node) {

    var list = [];
    return Promise.all(Object.keys(node).map(function (key) {
        var panelNode = {};
        panelNode[key] = node[key];
        return JSONREP.markupNode(panelNode).then(function (code) {

            list.push(code);
            return null;
        });
    })).then(function () {

        return list.join("\n");
    });
};
