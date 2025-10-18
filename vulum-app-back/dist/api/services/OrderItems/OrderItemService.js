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
exports.OrderItemService = void 0;
const typedi_1 = require("typedi");
const OrderItemRepository_1 = require("@api/repositories/OrderItems/OrderItemRepository");
const CategoryNotFoundException_1 = require("@api/exceptions/Categories/CategoryNotFoundException");
const EventDispatcher_1 = require("@base/decorators/EventDispatcher");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
let OrderItemService = class OrderItemService {
    constructor(orderItemRepository, eventDispatcher) {
        this.orderItemRepository = orderItemRepository;
        this.eventDispatcher = eventDispatcher;
        //
    }
    getAll(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderItemRepository.getManyAndCount(resourceOptions);
        });
    }
    findOneById(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getRequestedOrderOrFail(id, resourceOptions);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderItem = yield this.orderItemRepository.createOrderItem(data);
            this.eventDispatcher.dispatch('onOrderItemCreate', orderItem);
            return orderItem;
        });
    }
    updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderItem = yield this.getRequestedOrderOrFail(id);
            return yield this.orderItemRepository.updateOrder(orderItem, data);
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderItemRepository.delete(id);
        });
    }
    getRequestedOrderOrFail(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderItem = yield this.orderItemRepository.getOneById(id, resourceOptions);
            if (!orderItem) {
                throw new CategoryNotFoundException_1.CategoryNotFoundException();
            }
            return orderItem;
        });
    }
};
OrderItemService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(1, (0, EventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [OrderItemRepository_1.OrderItemRepository,
        EventDispatcher_1.EventDispatcherInterface])
], OrderItemService);
exports.OrderItemService = OrderItemService;
//# sourceMappingURL=OrderItemService.js.map