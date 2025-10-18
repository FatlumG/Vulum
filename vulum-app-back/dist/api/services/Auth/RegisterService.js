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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.RegisterService = void 0;
const typedi_1 = require("typedi");
const UserRepository_1 = require("@api/repositories/Users/UserRepository");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const EventDispatcher_1 = require("@base/decorators/EventDispatcher");
const AuthService_1 = require("@base/infrastructure/services/auth/AuthService");
let RegisterService = class RegisterService {
    constructor(userRepository, eventDispatcher, authService) {
        this.userRepository = userRepository;
        this.eventDispatcher = eventDispatcher;
        this.authService = authService;
        //
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.createUser(data);
            user = yield this.userRepository.findOne({
                where: { id: user.id },
                relations: ['role'],
            });
            this.eventDispatcher.dispatch('onUserRegister', user);
            return this.authService.sign({
                userId: user.id,
                email: user.email,
                role_id: user.role_id,
                role: user.role.role_name,
            }, { user: { id: user.id, email: user.email, role: user.role.role_name } });
        });
    }
};
RegisterService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(1, (0, EventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository,
        EventDispatcher_1.EventDispatcherInterface,
        AuthService_1.AuthService])
], RegisterService);
exports.RegisterService = RegisterService;
//# sourceMappingURL=RegisterService.js.map