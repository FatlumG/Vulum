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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanService = void 0;
const typedi_1 = require("typedi");
const PlanRepository_1 = require("@api/repositories/Plans/PlanRepository");
const CategoryNotFoundException_1 = require("@api/exceptions/Categories/CategoryNotFoundException");
const EventDispatcher_1 = require("@base/decorators/EventDispatcher");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const PEnum_1 = require("@base/api/models/Plans/PEnum");
const stripe_1 = __importDefault(require("@base/config/stripe"));
const UserRepository_1 = require("@base/api/repositories/Users/UserRepository");
let PlanService = class PlanService {
    constructor(planRepository, userRepository, eventDispatcher) {
        this.planRepository = planRepository;
        this.userRepository = userRepository;
        this.eventDispatcher = eventDispatcher;
        //
    }
    getAll(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planRepository.getManyAndCount(resourceOptions);
        });
    }
    findOneById(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getRequestedPlanOrFail(id, resourceOptions);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield stripe_1.default.products.create({
                name: data.plan_name,
                description: data.plan_description,
            });
            const price = yield stripe_1.default.prices.create({
                unit_amount: Math.round(data.price * 100),
                currency: 'usd',
                recurring: {
                    interval: data.billing_cycle === PEnum_1.BillingCycle.MONTHLY ? 'month' : 'year',
                },
                product: product.id,
            });
            const planWithStripe = Object.assign(Object.assign({}, data), { stripe_product_id: product.id, stripe_price_id: price.id });
            let plan = yield this.planRepository.createPlan(planWithStripe);
            this.eventDispatcher.dispatch('onPlanCreate', plan);
            return plan;
        });
    }
    createCheckoutSession(planId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.planRepository.findOne(planId);
            if (!plan || !plan.stripe_price_id) {
                throw new Error('Plan or Stripe price not found');
            }
            const session = yield stripe_1.default.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: plan.billing_cycle === 'none' ? 'payment' : 'subscription',
                customer_email: user.email,
                line_items: [
                    {
                        price: plan.stripe_price_id,
                        quantity: 1,
                    },
                ],
                // success?session_id={CHECKOUT_SESSION_ID}
                success_url: 'http://localhost:5173/dashboard',
                cancel_url: 'http://localhost:3000/cancel',
                metadata: { userId: user.userId, planId },
            });
            return { url: session.url };
        });
    }
    updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.getRequestedPlanOrFail(id);
            return yield this.planRepository.updatePlan(plan, data);
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planRepository.delete(id);
        });
    }
    getMyPlan(user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const fullUser = yield this.userRepository.findOne({
                where: { id: user.userId },
                relations: ['pricing_plan'],
            });
            return (_a = fullUser === null || fullUser === void 0 ? void 0 : fullUser.pricing_plan) !== null && _a !== void 0 ? _a : null;
        });
    }
    getRequestedPlanOrFail(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let plan = yield this.planRepository.getOneById(id, resourceOptions);
            if (!plan) {
                throw new CategoryNotFoundException_1.CategoryNotFoundException();
            }
            return plan;
        });
    }
};
PlanService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(1, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(2, (0, EventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [PlanRepository_1.PlanRepository,
        UserRepository_1.UserRepository,
        EventDispatcher_1.EventDispatcherInterface])
], PlanService);
exports.PlanService = PlanService;
//# sourceMappingURL=PlanService.js.map