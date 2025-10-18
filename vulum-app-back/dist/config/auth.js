"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = void 0;
const env_1 = require("@base/utils/env");
exports.authConfig = {
    defaultProvider: (0, env_1.env)('AUTH_DEFAULT_PROVIDER', 'jwt'),
    providers: {
        jwt: {
            secret: (0, env_1.env)('JWT_SECRET'),
            expiresIn: '7d',
        },
    },
};
//# sourceMappingURL=auth.js.map