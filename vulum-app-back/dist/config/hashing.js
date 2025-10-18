"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashingConfig = void 0;
const env_1 = require("@base/utils/env");
exports.hashingConfig = {
    defaultDriver: (0, env_1.env)('HASHING_DEFAULT_DRIVER', 'bcrypt'),
    disks: {
        bcrypt: {
            defaultRounds: 10,
        },
    },
};
//# sourceMappingURL=hashing.js.map