
exports['gi0.pinf.it/core/v0/tool'] = async function (workspace, LIB) {

    return async function (instance) {

        if (/\/builder\/v0$/.test(instance.kindId)) {

            const BUILDER = require("./_#_org.bashorigin_#_s1");

            return async function (invocation) {

                if (invocation.method === 'run') {

                    const config = invocation.config.config;
                    config.basedir = invocation.cwd;

                    await BUILDER.forConfig(config);

                    return true;
                }
            };            
        }
    };
}
