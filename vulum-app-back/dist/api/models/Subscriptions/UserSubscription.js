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
exports.UserSubscription = void 0;
const typeorm_1 = require("typeorm");
const EntityBase_1 = require("@base/infrastructure/abstracts/EntityBase");
const User_1 = require("../Users/User");
const Plan_1 = require("../Plans/Plan");
let UserSubscription = class UserSubscription extends EntityBase_1.EntityBase {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], UserSubscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserSubscription.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserSubscription.prototype, "plan_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], UserSubscription.prototype, "stripe_subscription_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused'],
        default: 'trialing',
    }),
    __metadata("design:type", String)
], UserSubscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", String)
], UserSubscription.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", String)
], UserSubscription.prototype, "current_period_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", String)
], UserSubscription.prototype, "trial_ends_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserSubscription.prototype, "cancel_at_period_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], UserSubscription.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], UserSubscription.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.subscriptions),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], UserSubscription.prototype, "usersList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Plan_1.Plan, (plan) => plan.subscriptions),
    (0, typeorm_1.JoinColumn)({ name: 'plan_id' }),
    __metadata("design:type", Plan_1.Plan)
], UserSubscription.prototype, "plansList", void 0);
UserSubscription = __decorate([
    (0, typeorm_1.Entity)({ name: 'subscriptions' })
], UserSubscription);
exports.UserSubscription = UserSubscription;
//# sourceMappingURL=UserSubscription.js.map