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
exports.UserSubscriptionController = void 0;
const routing_controllers_1 = require("routing-controllers");
const UserSubscriptionService_1 = require("@api/services/Subscription/UserSubscriptionService");
const typedi_1 = require("typedi");
const UserSubscriptionCreateRequest_1 = require("@api/requests/Subscriptions/UserSubscriptionCreateRequest");
const AuthCheck_1 = require("@base/infrastructure/middlewares/Auth/AuthCheck");
const ControllerBase_1 = require("@base/infrastructure/abstracts/ControllerBase");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const typeorm_simple_query_parser_1 = require("typeorm-simple-query-parser");
const LoggedUser_1 = require("@base/decorators/LoggedUser");
let UserSubscriptionController = class UserSubscriptionController extends ControllerBase_1.ControllerBase {
    constructor(userSubscriptionService) {
        super();
        this.userSubscriptionService = userSubscriptionService;
    }
    getAll(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.userSubscriptionService.getAll(resourceOptions);
        });
    }
    getOne(id, parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.userSubscriptionService.findOneById(id, resourceOptions);
        });
    }
    getMySubscription(loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userSubscriptionService.getMySubscription(loggedUser.userId);
        });
    }
    create(userSubscription) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userSubscriptionService.create(userSubscription);
        });
    }
    //   @Put('/:id')
    //   public async update(@Param('id') id: number, @Body() userSubscription: UserSubscriptionUpdateRequest) {
    //     return await this.userSubscriptionService.updateOneById(id, userSubscription);
    //   }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userSubscriptionService.deleteOneById(id);
        });
    }
};
__decorate([
    (0, routing_controllers_1.Get)(),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id([0-9]+)'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "getOne", null);
__decorate([
    (0, routing_controllers_1.Get)('/my-subscription'),
    __param(0, (0, LoggedUser_1.LoggedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "getMySubscription", null);
__decorate([
    (0, routing_controllers_1.Post)(),
    (0, routing_controllers_1.HttpCode)(201),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserSubscriptionCreateRequest_1.UserSubscriptionCreateRequest]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:id'),
    (0, routing_controllers_1.HttpCode)(204),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "delete", null);
UserSubscriptionController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_openapi_1.OpenAPI)({
        security: [{ bearerAuth: [] }],
    }),
    (0, routing_controllers_1.JsonController)('/user-subscription'),
    (0, routing_controllers_1.UseBefore)(AuthCheck_1.AuthCheck),
    __metadata("design:paramtypes", [UserSubscriptionService_1.UserSubscriptionService])
], UserSubscriptionController);
exports.UserSubscriptionController = UserSubscriptionController;
//# sourceMappingURL=UserSubscriptionController.js.map