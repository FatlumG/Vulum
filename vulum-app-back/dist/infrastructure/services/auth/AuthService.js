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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_1 = require("@base/config/auth");
const typedi_1 = require("typedi");
const JWTProvider_1 = require("./Providers/JWTProvider");
let AuthService = class AuthService {
    constructor() {
        this.setProvider(auth_1.authConfig.defaultProvider);
    }
    setProvider(provider) {
        switch (provider) {
            case 'jwt':
                this.provider = new JWTProvider_1.JWTProvider();
            default:
                break;
        }
        return this;
    }
    sign(payload, dataReturn) {
        return this.provider.sign(payload, dataReturn);
    }
};
AuthService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map