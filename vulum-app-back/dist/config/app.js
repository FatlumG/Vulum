"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const env_1 = require("@base/utils/env");
const to_bool_1 = require("@base/utils/to-bool");
function getAppPath() {
    let currentDir = __dirname;
    currentDir = currentDir.replace('/config', '');
    return currentDir;
}
exports.appConfig = {
    node: (0, env_1.env)('NODE_ENV') || 'development',
    isProduction: (0, env_1.env)('NODE_ENV') === 'production',
    isStaging: (0, env_1.env)('NODE_ENV') === 'staging',
    isDevelopment: (0, env_1.env)('NODE_ENV') === 'development',
    name: (0, env_1.env)('APP_NAME'),
    port: Number((0, env_1.env)('PORT') || (0, env_1.env)('APP_PORT') || 3000),
    routePrefix: (0, env_1.env)('APP_ROUTE_PREFIX'),
    url: (0, env_1.env)('APP_URL'),
    appPath: getAppPath(),
    cronJobsEnabled: (0, to_bool_1.toBool)((0, env_1.env)('ENABLE_CRON_JOBS')),
    graphqlEnabled: (0, to_bool_1.toBool)((0, env_1.env)('ENABLE_GRAPHQL')),
    entitiesDir: (0, env_1.env)('TYPEORM_ENTITIES_DIR'),
    controllersDir: (0, env_1.env)('CONTROLLERS_DIR'),
    cronJobsDir: (0, env_1.env)('CRON_JOBS_DIR'),
    middlewaresDir: (0, env_1.env)('MIDDLEWARES_DIR'),
    eventsDir: (0, env_1.env)('EVENTS_DIR'),
    subscribersDir: (0, env_1.env)('SUBSCRIBERS_DIR'),
    resolversDir: (0, env_1.env)('RESOLVERS_DIR'),
};
//# sourceMappingURL=app.js.map