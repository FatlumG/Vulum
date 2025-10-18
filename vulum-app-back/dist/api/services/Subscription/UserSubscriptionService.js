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
exports.UserSubscriptionService = void 0;
const typedi_1 = require("typedi");
const UserSubscriptionRepository_1 = require("@api/repositories/Subscriptions/UserSubscriptionRepository");
const CategoryNotFoundException_1 = require("@api/exceptions/Categories/CategoryNotFoundException");
const EventDispatcher_1 = require("@base/decorators/EventDispatcher");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
let UserSubscriptionService = class UserSubscriptionService {
    constructor(userSubscriptionRepository, eventDispatcher) {
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.eventDispatcher = eventDispatcher;
        //
    }
    getAll(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userSubscriptionRepository.getManyAndCount(resourceOptions);
        });
    }
    findOneById(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getRequestedSubscriptionsOrFail(id, resourceOptions);
        });
    }
    getMySubscription(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this.userSubscriptionRepository
                .createQueryBuilder('subscription')
                .leftJoinAndSelect('subscription.plansList', 'plan')
                .leftJoin('subscription.usersList', 'user')
                .where('user.id = :userId', { userId: user_id })
                .orderBy('subscription.id', 'DESC')
                .select(['subscription.plan_id'])
                .getOne();
            console.log(subscription);
            return subscription;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let subscriptions = yield this.userSubscriptionRepository.createUserSubscription(data);
            this.eventDispatcher.dispatch('onSubscriptionsCreate', subscriptions);
            return subscriptions;
        });
    }
    updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptions = yield this.getRequestedSubscriptionsOrFail(id);
            return yield this.userSubscriptionRepository.updateUserSubscription(subscriptions, data);
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userSubscriptionRepository.delete(id);
        });
    }
    getRequestedSubscriptionsOrFail(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let subscriptions = yield this.userSubscriptionRepository.getOneById(id, resourceOptions);
            if (!subscriptions) {
                throw new CategoryNotFoundException_1.CategoryNotFoundException();
            }
            return subscriptions;
        });
    }
};
UserSubscriptionService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(1, (0, EventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [UserSubscriptionRepository_1.UserSubscriptionRepository,
        EventDispatcher_1.EventDispatcherInterface])
], UserSubscriptionService);
exports.UserSubscriptionService = UserSubscriptionService;
//# sourceMappingURL=UserSubscriptionService.js.map