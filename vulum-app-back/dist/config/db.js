"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const env_1 = require("@base/utils/env");
exports.dbConfig = {
    dbConnection: (0, env_1.env)('TYPEORM_CONNECTION'),
    dbHost: (0, env_1.env)('TYPEORM_HOST'),
    dbPort: (0, env_1.env)('TYPEORM_PORT'),
    dbDatabase: (0, env_1.env)('TYPEORM_DATABASE'),
    dbUsername: (0, env_1.env)('TYPEORM_USERNAME'),
    dbPassword: (0, env_1.env)('TYPEORM_PASSWORD'),
    dbEntities: (0, env_1.env)('TYPEORM_ENTITIES'),
    allowLogging: (0, env_1.env)('TYPEORM_LOGGING'),
};
//# sourceMappingURL=db.js.map