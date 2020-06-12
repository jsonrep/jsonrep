
let runHomeInstructions = null;

exports['gi0.PINF.it/build/v0'] = async function (LIB, CLASSES) {

    const BUILDER = require("./builder");

    class BuildStep extends CLASSES.BuildStep {

        async onHome (result, home, workspace) {
            await runHomeInstructions();
        }

        async onBuild (result, build, target, instance, home, workspace) {

            const config = JSON.parse(JSON.stringify(build.config));

            if (config.dist) throw new Error(`'dist' config property may not be set!`);

            config.basedir = config.basedir || build.path;
            config.dist = target.path;

            await BUILDER.forConfig(config, {
                LIB: LIB,
                workspace: workspace,
                home: home,
                target: target,
                build: build,
                result: result
            });
        }
    }

    return BuildStep;
}


exports.inf = async function (INF, NS) {
    return {
        invoke: async function (pointer, value, options) {
            if (pointer === 'onHome()') {
                runHomeInstructions = async function () {
                    await INF.load(value);
                }
                return true;
            }
        }
    };
}
