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
exports.UserSubscriptionCreateRequest = exports.SubscriptionStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("@base/api/models/Users/User");
const Plan_1 = require("@base/api/models/Plans/Plan");
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["INCOMPLETE"] = "incomplete";
    SubscriptionStatus["INCOMPLETE_EXPIRED"] = "incomplete_expired";
    SubscriptionStatus["TRIALING"] = "trialing";
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["PAST_DUE"] = "past_due";
    SubscriptionStatus["CANCELED"] = "canceled";
    SubscriptionStatus["UNPAID"] = "unpaid";
    SubscriptionStatus["PAUSED"] = "paused";
})(SubscriptionStatus = exports.SubscriptionStatus || (exports.SubscriptionStatus = {}));
let UserSubscriptionCreateRequest = class UserSubscriptionCreateRequest {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserSubscriptionCreateRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserSubscriptionCreateRequest.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserSubscriptionCreateRequest.prototype, "plan_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserSubscriptionCreateRequest.prototype, "stripe_subscription_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SubscriptionStatus,
    }),
    __metadata("design:type", String)
], UserSubscriptionCreateRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], UserSubscriptionCreateRequest.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], UserSubscriptionCreateRequest.prototype, "current_period_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UserSubscriptionCreateRequest.prototype, "trial_ends_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserSubscriptionCreateRequest.prototype, "cancel_at_period_end", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserSubscriptionCreateRequest.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserSubscriptionCreateRequest.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], UserSubscriptionCreateRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Plan_1.Plan),
    (0, typeorm_1.JoinColumn)({ name: 'plan_id' }),
    __metadata("design:type", Plan_1.Plan)
], UserSubscriptionCreateRequest.prototype, "pricingPlan", void 0);
UserSubscriptionCreateRequest = __decorate([
    (0, typeorm_1.Entity)('subscriptions')
], UserSubscriptionCreateRequest);
exports.UserSubscriptionCreateRequest = UserSubscriptionCreateRequest;
//# sourceMappingURL=UserSubscriptionCreateRequest.js.map