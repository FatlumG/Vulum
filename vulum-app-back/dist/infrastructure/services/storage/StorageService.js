"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const filesystems_1 = require("@base/config/filesystems");
const typedi_1 = require("typedi");
const LocalDisk_1 = require("./Providers/LocalDisk");
let StorageService = class StorageService {
    constructor() {
        this.setDisk(filesystems_1.fileSystemsConfig.defaultDisk);
    }
    setDisk(disk) {
        switch (disk) {
            case 'local':
                this.disk = new LocalDisk_1.LocalDisk();
                break;
            default:
                break;
        }
        return this;
    }
    put(filePath, content, encoding) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.disk.put(filePath, content, encoding);
        });
    }
    createDirectory(dir) {
        return this.disk.createDirectory(dir);
    }
};
StorageService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], StorageService);
exports.StorageService = StorageService;
//# sourceMappingURL=StorageService.js.map