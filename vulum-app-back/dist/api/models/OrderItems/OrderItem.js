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
exports.OrderItem = void 0;
const typeorm_1 = require("typeorm");
const EntityBase_1 = require("@base/infrastructure/abstracts/EntityBase");
const Product_1 = require("../Products/Product");
const Order_1 = require("../Orders/Order");
let OrderItem = class OrderItem extends EntityBase_1.EntityBase {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], OrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderItem.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderItem.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 8, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], OrderItem.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_1.Order, (order) => order.orderItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", Order_1.Order)
], OrderItem.prototype, "ordersList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.orderItemsList, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", Product_1.Product)
], OrderItem.prototype, "productsList", void 0);
OrderItem = __decorate([
    (0, typeorm_1.Entity)({ name: 'order_items' })
], OrderItem);
exports.OrderItem = OrderItem;
//# sourceMappingURL=OrderItem.js.map