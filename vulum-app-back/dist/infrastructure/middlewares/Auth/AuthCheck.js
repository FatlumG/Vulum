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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCheck = void 0;
const typedi_1 = require("typedi");
const jwt = __importStar(require("jsonwebtoken"));
const auth_1 = require("@base/config/auth");
let AuthCheck = class AuthCheck {
    use(request, response, next) {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return response.status(401).send({ status: 403, message: 'Unauthorized!' });
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, auth_1.authConfig.providers.jwt.secret, (err, user) => {
            if (err) {
                return response.status(403).send({ status: 403, message: 'Forbidden!' });
            }
            request.loggedUser = user;
            next();
        });
    }
};
AuthCheck = __decorate([
    (0, typedi_1.Service)()
], AuthCheck);
exports.AuthCheck = AuthCheck;
//# sourceMappingURL=AuthCheck.js.map