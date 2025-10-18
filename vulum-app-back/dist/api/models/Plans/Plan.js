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
exports.Plan = void 0;
const typeorm_1 = require("typeorm");
const EntityBase_1 = require("@base/infrastructure/abstracts/EntityBase");
const PEnum_1 = require("./PEnum");
const User_1 = require("../Users/User");
const UserSubscription_1 = require("../Subscriptions/UserSubscription");
let Plan = class Plan extends EntityBase_1.EntityBase {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Plan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Plan.prototype, "plan_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Plan.prototype, "plan_description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Plan.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: PEnum_1.BillingCycle.NONE }),
    __metadata("design:type", String)
], Plan.prototype, "billing_cycle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], Plan.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "stripe_price_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "stripe_product_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User_1.User, (user) => user.pricing_plan),
    __metadata("design:type", Array)
], Plan.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserSubscription_1.UserSubscription, (subscription) => subscription.plansList),
    __metadata("design:type", Array)
], Plan.prototype, "subscriptions", void 0);
Plan = __decorate([
    (0, typeorm_1.Entity)({ name: 'pricing' })
], Plan);
exports.Plan = Plan;
//# sourceMappingURL=Plan.js.map