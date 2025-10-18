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
exports.UserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const UserService_1 = require("@api/services/Users/UserService");
const typedi_1 = require("typedi");
const UserCreateRequest_1 = require("@api/requests/Users/UserCreateRequest");
const AuthCheck_1 = require("@base/infrastructure/middlewares/Auth/AuthCheck");
const HasRole_1 = require("@base/infrastructure/middlewares/Auth/HasRole");
const ControllerBase_1 = require("@base/infrastructure/abstracts/ControllerBase");
const UserUpdateRequest_1 = require("@api/requests/Users/UserUpdateRequest");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const typeorm_simple_query_parser_1 = require("typeorm-simple-query-parser");
const LoggedUser_1 = require("@base/decorators/LoggedUser");
const multer_1 = require("@base/utils/multer");
let UserController = class UserController extends ControllerBase_1.ControllerBase {
    constructor(userService) {
        super();
        this.userService = userService;
    }
    getAll(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.userService.getAll(resourceOptions);
        });
    }
    getOne(id, parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.userService.findOneById(id, resourceOptions);
        });
    }
    getMe(parseResourceOptions, loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.userService.findOneById(loggedUser.userId, resourceOptions);
        });
    }
    getProfile(loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.getProfile(loggedUser.userId);
        });
    }
    getBySearch(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.getUsersBySearch(username);
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.create(user);
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.updateOneById(id, user);
        });
    }
    updateMyProfilePicture(loggedUser, req, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                throw new Error('Image is required!');
            }
            return yield this.userService.updateProfilePicture(loggedUser.userId, file.path);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.deleteOneById(id);
        });
    }
};
__decorate([
    (0, routing_controllers_1.Get)(),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id([0-9]+)'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOne", null);
__decorate([
    (0, routing_controllers_1.Get)('/me'),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __param(1, (0, LoggedUser_1.LoggedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, routing_controllers_1.Get)('/profile'),
    __param(0, (0, LoggedUser_1.LoggedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, routing_controllers_1.Get)('/:username'),
    __param(0, (0, routing_controllers_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBySearch", null);
__decorate([
    (0, routing_controllers_1.Post)(),
    (0, routing_controllers_1.HttpCode)(201),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserCreateRequest_1.UserCreateRequest]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Patch)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UserUpdateRequest_1.UserUpdateRequest]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Put)('/update-my-profile-picture'),
    (0, routing_controllers_1.UseBefore)(multer_1.upload.single('image')) // Multer middleware to handle 'image' field
    ,
    __param(0, (0, LoggedUser_1.LoggedUser)()),
    __param(1, (0, routing_controllers_1.Req)()),
    __param(2, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMyProfilePicture", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:id'),
    (0, routing_controllers_1.UseBefore)((0, HasRole_1.HasRole)('admin')),
    (0, routing_controllers_1.HttpCode)(204),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
UserController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_openapi_1.OpenAPI)({
        security: [{ bearerAuth: [] }],
    }),
    (0, routing_controllers_1.JsonController)('/users'),
    (0, routing_controllers_1.UseBefore)(AuthCheck_1.AuthCheck),
    __metadata("design:paramtypes", [UserService_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map