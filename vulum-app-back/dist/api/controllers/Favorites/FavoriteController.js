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
exports.FavoriteController = void 0;
const routing_controllers_1 = require("routing-controllers");
const FavoriteService_1 = require("@api/services/Favorites/FavoriteService");
const typedi_1 = require("typedi");
const FavoriteCreateRequest_1 = require("@api/requests/Favorites/FavoriteCreateRequest");
const AuthCheck_1 = require("@base/infrastructure/middlewares/Auth/AuthCheck");
const ControllerBase_1 = require("@base/infrastructure/abstracts/ControllerBase");
const FavoriteUpdateRequest_1 = require("@api/requests/Favorites/FavoriteUpdateRequest");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const typeorm_simple_query_parser_1 = require("typeorm-simple-query-parser");
const LoggedUser_1 = require("@base/decorators/LoggedUser");
const UserService_1 = require("@base/api/services/Users/UserService");
let FavoriteController = class FavoriteController extends ControllerBase_1.ControllerBase {
    constructor(favoriteService, userService) {
        super();
        this.favoriteService = favoriteService;
        this.userService = userService;
    }
    getAll(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.favoriteService.getAll(resourceOptions);
        });
    }
    getOne(id, parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.favoriteService.findOneById(id, resourceOptions);
        });
    }
    create(favorite, loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.favoriteService.create(favorite, loggedUser);
        });
    }
    update(id, favorite) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.favoriteService.updateOneById(id, favorite);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.favoriteService.deleteOneById(id);
        });
    }
    getMyFavorites(loggedUser, parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseResourceOptions.getPage() || 1;
            const limit = parseResourceOptions.parseLimit() || 10;
            console.log(loggedUser, 'loggedUser');
            console.log(page, 'page');
            console.log(limit, 'limit');
            return yield this.favoriteService.getMyFavorites(loggedUser, page, limit);
        });
    }
};
__decorate([
    (0, routing_controllers_1.Get)(),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id([0-9]+)'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "getOne", null);
__decorate([
    (0, routing_controllers_1.Post)(),
    (0, routing_controllers_1.HttpCode)(201),
    __param(0, (0, routing_controllers_1.Body)()),
    __param(1, (0, LoggedUser_1.LoggedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FavoriteCreateRequest_1.FavoriteCreateRequest, Object]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Put)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, FavoriteUpdateRequest_1.FavoriteUpdateRequest]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:id'),
    (0, routing_controllers_1.HttpCode)(204),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "delete", null);
__decorate([
    (0, routing_controllers_1.Get)('/get-my-favorites'),
    __param(0, (0, LoggedUser_1.LoggedUser)()),
    __param(1, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "getMyFavorites", null);
FavoriteController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_openapi_1.OpenAPI)({
        security: [{ bearerAuth: [] }],
    }),
    (0, routing_controllers_1.JsonController)('/favorites'),
    (0, routing_controllers_1.UseBefore)(AuthCheck_1.AuthCheck),
    __metadata("design:paramtypes", [FavoriteService_1.FavoriteService, UserService_1.UserService])
], FavoriteController);
exports.FavoriteController = FavoriteController;
//# sourceMappingURL=FavoriteController.js.map