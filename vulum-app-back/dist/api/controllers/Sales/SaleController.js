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
exports.SaleController = void 0;
const routing_controllers_1 = require("routing-controllers");
const SaleService_1 = require("@api/services/Sales/SaleService");
const typedi_1 = require("typedi");
const SaleCreateRequest_1 = require("@api/requests/Sales/SaleCreateRequest");
const AuthCheck_1 = require("@base/infrastructure/middlewares/Auth/AuthCheck");
const ControllerBase_1 = require("@base/infrastructure/abstracts/ControllerBase");
const SaleUpdateRequest_1 = require("@api/requests/Sales/SaleUpdateRequest");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const typeorm_simple_query_parser_1 = require("typeorm-simple-query-parser");
let SaleController = class SaleController extends ControllerBase_1.ControllerBase {
    constructor(saleService) {
        super();
        this.saleService = saleService;
    }
    getAll(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.saleService.getAll(resourceOptions);
        });
    }
    getOne(id, parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.saleService.findOneById(id, resourceOptions);
        });
    }
    create(sale) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.saleService.create(sale);
        });
    }
    update(id, sale) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.saleService.updateOneById(id, sale);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.saleService.deleteOneById(id);
        });
    }
};
__decorate([
    (0, routing_controllers_1.Get)(),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id([0-9]+)'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "getOne", null);
__decorate([
    (0, routing_controllers_1.Post)(),
    (0, routing_controllers_1.HttpCode)(201),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SaleCreateRequest_1.SaleCreateRequest]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Put)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, SaleUpdateRequest_1.SaleUpdateRequest]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:id'),
    (0, routing_controllers_1.HttpCode)(204),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "delete", null);
SaleController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_openapi_1.OpenAPI)({
        security: [{ bearerAuth: [] }],
    }),
    (0, routing_controllers_1.JsonController)('/sales'),
    (0, routing_controllers_1.UseBefore)(AuthCheck_1.AuthCheck),
    __metadata("design:paramtypes", [SaleService_1.SaleService])
], SaleController);
exports.SaleController = SaleController;
//# sourceMappingURL=SaleController.js.map