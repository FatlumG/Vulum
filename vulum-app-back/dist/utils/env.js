"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envOrFail = exports.env = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // { path: `.env.${process.env.NODE_ENV}` }
function env(key, defaultValue = null) {
    var _a;
    return (_a = process.env[key]) !== null && _a !== void 0 ? _a : defaultValue;
}
exports.env = env;
function envOrFail(key) {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return process.env[key];
}
exports.envOrFail = envOrFail;
//# sourceMappingURL=env.js.map