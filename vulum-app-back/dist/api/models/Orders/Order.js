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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const EntityBase_1 = require("@base/infrastructure/abstracts/EntityBase");
const OEnum_1 = require("./OEnum");
const OrderItem_1 = require("../OrderItems/OrderItem");
const User_1 = require("../Users/User");
const Invoice_1 = require("../Invoices/Invoice");
let Order = class Order extends EntityBase_1.EntityBase {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 8, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: OEnum_1.OrderStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], Order.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderItem_1.OrderItem, (orderItem) => orderItem.ordersList),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.orders),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", User_1.User)
], Order.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Invoice_1.Invoice, (invoice) => invoice.order),
    (0, typeorm_1.JoinColumn)({ name: 'invoice_id' }),
    __metadata("design:type", Array)
], Order.prototype, "invoices", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)({ name: 'orders' })
], Order);
exports.Order = Order;
//# sourceMappingURL=Order.js.map