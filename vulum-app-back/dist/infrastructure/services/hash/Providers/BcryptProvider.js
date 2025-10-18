"use strict";
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
exports.BcryptProvider = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashing_1 = require("@base/config/hashing");
class BcryptProvider {
    constructor() {
        this.bcrypt = bcrypt_1.default;
        this.defaultRounds = hashing_1.hashingConfig.disks.bcrypt.defaultRounds;
    }
    make(data, saltOrRounds = this.defaultRounds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bcrypt.hash(data, saltOrRounds);
        });
    }
    compare(data, encrypted) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bcrypt.compare(data, encrypted);
        });
    }
}
exports.BcryptProvider = BcryptProvider;
//# sourceMappingURL=BcryptProvider.js.map