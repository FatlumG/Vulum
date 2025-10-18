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
exports.FavoriteService = void 0;
const typedi_1 = require("typedi");
const FavoriteRepository_1 = require("@api/repositories/Favorites/FavoriteRepository");
const CategoryNotFoundException_1 = require("@api/exceptions/Categories/CategoryNotFoundException");
const EventDispatcher_1 = require("@base/decorators/EventDispatcher");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const UserRepository_1 = require("@base/api/repositories/Users/UserRepository");
const ProductRepository_1 = require("@base/api/repositories/Products/ProductRepository");
let FavoriteService = class FavoriteService {
    constructor(favoriteRepository, productRepository, userRepository, eventDispatcher) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.eventDispatcher = eventDispatcher;
        //
    }
    getAll(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.favoriteRepository.getManyAndCount(resourceOptions);
        });
    }
    findOneById(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getRequestedFavoriteOrFail(id, resourceOptions);
        });
    }
    create(data, loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingFavorite = yield this.favoriteRepository.findOne({
                where: {
                    user_id: loggedUser.userId,
                    product_id: data.product_id,
                },
            });
            console.log(existingFavorite, 'existingFavorite');
            if (existingFavorite) {
                throw new Error('This Product is already saved!');
            }
            const favorite = yield this.favoriteRepository.createFavorite(Object.assign(Object.assign({}, data), { user_id: loggedUser.userId }));
            const user = yield this.userRepository
                .createQueryBuilder('user')
                .where('user.id = :id', { id: favorite.user_id })
                .select(['user.username', 'user.first_name', 'user.last_name', 'user.email', 'user.phone', 'user.favorites'])
                .getOne();
            const product = yield this.productRepository
                .createQueryBuilder('products')
                .where('products.id = :id', { id: favorite.product_id })
                .select(['products.product_name', 'products.product_description', 'products.price'])
                .getOne();
            this.eventDispatcher.dispatch('onFavoriteCreate', favorite);
            this.userRepository.update(favorite.user_id, { favorites: user.favorites + 1 });
            return Object.assign(Object.assign({}, favorite), { user,
                product });
        });
    }
    updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const favorite = yield this.getRequestedFavoriteOrFail(id);
            return yield this.favoriteRepository.updateFavorite(favorite, data);
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.favoriteRepository.delete(id);
        });
    }
    getRequestedFavoriteOrFail(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let favorite = yield this.favoriteRepository.getOneById(id, resourceOptions);
            if (!favorite) {
                throw new CategoryNotFoundException_1.CategoryNotFoundException();
            }
            return favorite;
        });
    }
    countFavoritesForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.favoriteRepository.count({ where: { user_id: userId } });
        });
    }
    getMyFavorites(user, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [items, total] = yield this.favoriteRepository
                .createQueryBuilder('favorite')
                .leftJoinAndSelect('favorite.product', 'product')
                .leftJoinAndSelect('product.productImages', 'productImages')
                .where('favorite.user_id = :userId', { userId: user.userId })
                .skip(skip)
                .take(limit)
                .getManyAndCount();
            return {
                items,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
};
FavoriteService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(1, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(2, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(3, (0, EventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [FavoriteRepository_1.FavoriteRepository,
        ProductRepository_1.ProductRepository,
        UserRepository_1.UserRepository,
        EventDispatcher_1.EventDispatcherInterface])
], FavoriteService);
exports.FavoriteService = FavoriteService;
//# sourceMappingURL=FavoriteService.js.map