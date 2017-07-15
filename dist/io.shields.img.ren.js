
PINF.bundle("", function(require) {

    require.memoize("/main.js", function(require, exports, module) {

        exports.main = function (node) {

            return "JSONREP";
        }
	});
});
