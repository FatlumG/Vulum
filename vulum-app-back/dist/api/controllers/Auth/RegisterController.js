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
exports.RegisterController = void 0;
const typedi_1 = require("typedi");
const routing_controllers_1 = require("routing-controllers");
const RegisterRequest_1 = require("@api/requests/Auth/RegisterRequest");
const RegisterService_1 = require("@api/services/Auth/RegisterService");
const ControllerBase_1 = require("@base/infrastructure/abstracts/ControllerBase");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
let RegisterController = class RegisterController extends ControllerBase_1.ControllerBase {
    constructor(registerService) {
        super();
        this.registerService = registerService;
    }
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.registerService.register(user);
        });
    }
};
__decorate([
    (0, routing_controllers_1.Post)(),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterRequest_1.RegisterRequest]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "register", null);
RegisterController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_openapi_1.OpenAPI)({
        tags: ['Auth'],
    }),
    (0, routing_controllers_1.JsonController)('/register'),
    __metadata("design:paramtypes", [RegisterService_1.RegisterService])
], RegisterController);
exports.RegisterController = RegisterController;
//# sourceMappingURL=RegisterController.js.map