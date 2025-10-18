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
exports.PlanController = void 0;
const routing_controllers_1 = require("routing-controllers");
const PlanService_1 = require("@api/services/Plans/PlanService");
const typedi_1 = require("typedi");
const PlanCreateRequest_1 = require("@api/requests/Plans/PlanCreateRequest");
const AuthCheck_1 = require("@base/infrastructure/middlewares/Auth/AuthCheck");
const ControllerBase_1 = require("@base/infrastructure/abstracts/ControllerBase");
const PlanUpdateRequest_1 = require("@api/requests/Plans/PlanUpdateRequest");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const typeorm_simple_query_parser_1 = require("typeorm-simple-query-parser");
const LoggedUser_1 = require("@base/decorators/LoggedUser");
const PlanSubscribeRequest_1 = require("@base/api/requests/Plans/PlanSubscribeRequest");
let PlanController = class PlanController extends ControllerBase_1.ControllerBase {
    constructor(planService) {
        super();
        this.planService = planService;
    }
    getAll(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.planService.getAll(resourceOptions);
        });
    }
    getOne(id, parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.planService.findOneById(id, resourceOptions);
        });
    }
    create(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planService.create(plan);
        });
    }
    createCheckoutSession(data, loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planService.createCheckoutSession(data.plan_id, loggedUser);
        });
    }
    update(id, plan) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planService.updateOneById(id, plan);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planService.deleteOneById(id);
        });
    }
    getMyPlan(loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planService.getMyPlan(loggedUser);
        });
    }
};
__decorate([
    (0, routing_controllers_1.Get)(),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id([0-9]+)'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "getOne", null);
__decorate([
    (0, routing_controllers_1.Post)(),
    (0, routing_controllers_1.HttpCode)(201),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlanCreateRequest_1.PlanCreateRequest]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Post)('/checkout-session'),
    (0, routing_controllers_1.HttpCode)(200),
    __param(0, (0, routing_controllers_1.Body)()),
    __param(1, (0, LoggedUser_1.LoggedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlanSubscribeRequest_1.PlanSubscribeRequest, Object]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "createCheckoutSession", null);
__decorate([
    (0, routing_controllers_1.Put)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, PlanUpdateRequest_1.PlanUpdateRequest]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:id'),
    (0, routing_controllers_1.HttpCode)(204),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "delete", null);
__decorate([
    (0, routing_controllers_1.Get)('/myPlan'),
    __param(0, (0, LoggedUser_1.LoggedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "getMyPlan", null);
PlanController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_openapi_1.OpenAPI)({
        security: [{ bearerAuth: [] }],
    }),
    (0, routing_controllers_1.JsonController)('/pricing'),
    (0, routing_controllers_1.UseBefore)(AuthCheck_1.AuthCheck),
    __metadata("design:paramtypes", [PlanService_1.PlanService])
], PlanController);
exports.PlanController = PlanController;
//# sourceMappingURL=PlanController.js.map