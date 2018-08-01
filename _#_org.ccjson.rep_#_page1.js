
exports.forLib = function (LIB) {

    return LIB.Promise.resolve({
        forConfig: function (defaultConfig) {

            var JsonrepPageEntity = function (instanceConfig) {
                var self = this;

                var config = {};
                LIB._.merge(config, defaultConfig)
                LIB._.merge(config, instanceConfig)
                delete config["$alias"];

                self.forConfig = function (CONFIG) {
                    
                    CONFIG.reps = instanceConfig.reps;
                    CONFIG.page = {};
                    CONFIG.page["@" + config.alias] = config.node;

                    return require("./_#_org.bashorigin_#_s1").forConfig(CONFIG);
                }

            }
            JsonrepPageEntity.prototype.config = defaultConfig;

            return JsonrepPageEntity;
        }
    });
}
