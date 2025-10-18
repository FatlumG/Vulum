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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalDisk = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const filesystems_1 = require("@base/config/filesystems");
class LocalDisk {
    constructor() {
        this.root = filesystems_1.fileSystemsConfig.disks.local.root;
    }
    put(filePath, content, encoding) {
        return __awaiter(this, void 0, void 0, function* () {
            filePath = this.root + '/' + filePath;
            return new Promise((resolve, reject) => {
                if (!filePath || !filePath.trim())
                    return reject(new Error('The path is required!'));
                if (!content)
                    return reject(new Error('The content is required!'));
                const dir = path_1.default.dirname(filePath);
                if (!fs.existsSync(dir))
                    this.createDirectory(dir);
                if (dir === filePath.trim())
                    return reject(new Error('The path is invalid!'));
                fs.writeFile(filePath, content, { encoding }, (error) => {
                    if (error)
                        return reject(error);
                    resolve();
                });
            });
        });
    }
    createDirectory(dir) {
        const splitPath = dir.split('/');
        if (splitPath.length > 20)
            throw new Error('The path is invalid!');
        splitPath.reduce((path, subPath) => {
            let currentPath;
            if (subPath !== '.') {
                currentPath = path + '/' + subPath;
                if (!fs.existsSync(currentPath))
                    fs.mkdirSync(currentPath);
            }
            else
                currentPath = subPath;
            return currentPath;
        }, '');
    }
}
exports.LocalDisk = LocalDisk;
//# sourceMappingURL=LocalDisk.js.map