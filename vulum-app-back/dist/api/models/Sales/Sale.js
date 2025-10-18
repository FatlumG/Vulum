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
exports.Sale = void 0;
const typeorm_1 = require("typeorm");
const EntityBase_1 = require("@base/infrastructure/abstracts/EntityBase");
const User_1 = require("../Users/User");
const Order_1 = require("../Orders/Order");
let Sale = class Sale extends EntityBase_1.EntityBase {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Sale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Sale.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Sale.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 8, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "total_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], Sale.prototype, "sold_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.sales),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], Sale.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (order) => order.id),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", Order_1.Order)
], Sale.prototype, "order", void 0);
Sale = __decorate([
    (0, typeorm_1.Entity)({ name: 'sales' })
], Sale);
exports.Sale = Sale;
//# sourceMappingURL=Sale.js.map