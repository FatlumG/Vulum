"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSystemsConfig = void 0;
const env_1 = require("@base/utils/env");
const app_1 = require("./app");
exports.fileSystemsConfig = {
    defaultDisk: (0, env_1.env)('FILESYSTEM_DEFAULT_DISK', 'local'),
    disks: {
        local: {
            root: app_1.appConfig.appPath + '/public/uploads',
        },
    },
};
//# sourceMappingURL=filesystems.js.map