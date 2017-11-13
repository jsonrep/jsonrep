
exports.main = function (JSONREP, node) {

    return JSONREP.makeRep({
        variables: {
            message: node.message
        },
        html: (html (variables) >>>

            <div>
                %%%variables.message%%%
            </div>

        <<<),
        css: (css () >>>

            :scope {
                border: 1px solid black;
                padding: 5px;
            }

        <<<),
        on: {
            mount: function (el) {

                el.innerHTML = el.innerHTML.replace(/\n$/, "") + "!";
            }
        }
    });
};
