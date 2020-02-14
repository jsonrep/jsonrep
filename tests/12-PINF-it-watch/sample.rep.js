
exports.main = function (JSONREP, node, options) {

    return JSONREP.makeRep2({
        "config": {
            "node": node,
            "append": "!"
        },
        "code": (riotjs:makeRep () >>>

            <div></div>

            <style>
                :scope {
                    border: 1px solid black;
                    padding: 5px;
                }
            </style>

            <script>

                this.root.innerHTML = [
                    this.opts.config.node.message,
                    this.opts.config.append
                ].join("");

            </script>

        <<<)
    }, options);
};
