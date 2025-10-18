"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailConfig = void 0;
const env_1 = require("@base/utils/env");
exports.mailConfig = {
    provider: (0, env_1.env)('MAIL_PROVIDER'),
    host: (0, env_1.env)('MAIL_HOST'),
    port: Number((0, env_1.env)('MAIL_PORT')),
    authUser: (0, env_1.env)('MAIL_AUTH_USER'),
    authPassword: (0, env_1.env)('MAIL_AUTH_PASSWORD'),
    fromName: (0, env_1.env)('MAIL_FROM_NAME'),
};
//# sourceMappingURL=mail.js.map