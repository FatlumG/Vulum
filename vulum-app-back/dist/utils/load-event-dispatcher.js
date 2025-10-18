"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEventDispatcher = void 0;
const glob_1 = __importDefault(require("glob"));
const app_1 = require("@base/config/app");
/**
 * This loads all the created subscribers into the project, so we do not have to import them manually.
 */
function loadEventDispatcher() {
    const patterns = app_1.appConfig.appPath + app_1.appConfig.eventsDir;
    (0, glob_1.default)(patterns, (err, files) => {
        for (const file of files) {
            require(file);
        }
    });
}
exports.loadEventDispatcher = loadEventDispatcher;
//# sourceMappingURL=load-event-dispatcher.js.map