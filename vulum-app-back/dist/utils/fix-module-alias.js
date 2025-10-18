"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixModuleAlias = void 0;
const module_alias_1 = __importDefault(require("module-alias"));
function fixModuleAlias(dirName) {
    module_alias_1.default.addAliases({
        '@base': dirName,
        '@api': dirName + '/api',
    });
}
exports.fixModuleAlias = fixModuleAlias;
//# sourceMappingURL=fix-module-alias.js.map