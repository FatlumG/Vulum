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
exports.ProductService = void 0;
const typedi_1 = require("typedi");
const ProductRepository_1 = require("@api/repositories/Products/ProductRepository");
const CategoryNotFoundException_1 = require("@api/exceptions/Categories/CategoryNotFoundException");
const EventDispatcher_1 = require("@base/decorators/EventDispatcher");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const UserRepository_1 = require("@base/api/repositories/Users/UserRepository");
const stripe_1 = __importDefault(require("@base/config/stripe"));
let ProductService = class ProductService {
    constructor(productRepository, userRepository, eventDispatcher) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.eventDispatcher = eventDispatcher;
    }
    getAll(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.findAndCount(Object.assign(Object.assign({}, resourceOptions), { relations: ['productImages'] }));
        });
    }
    getAvailableProducts(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.find(Object.assign(Object.assign({ where: { status: 'available' } }, resourceOptions), { relations: ['productImages'], order: { id: 'DESC' } }));
        });
    }
    getPendingProducts(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.find(Object.assign(Object.assign({ where: { status: 'pending' } }, resourceOptions), { relations: ['productImages'], order: { id: 'DESC' } }));
        });
    }
    getUnavailableProducts(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.find(Object.assign(Object.assign({ where: { status: 'unavailable' } }, resourceOptions), { relations: ['productImages'], order: { id: 'DESC' } }));
        });
    }
    getSoldProducts(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.find(Object.assign({ where: { Status: 'sold' } }, resourceOptions));
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // const product = await this.productRepository
            //   .createQueryBuilder('product')
            //   .leftJoinAndSelect('product.productImages', 'productImages')
            //   .leftJoinAndSelect('product.category', 'category')
            //   .select([
            //     'product.id',
            //     'product.product_name',
            //     'product.product_description',
            //     'product.price',
            //     'product.stock',
            //     'category.id',
            //     'category.category_name',
            //     'productImages.image_url',
            //   ])
            //   .where('product.id = :id', { id })
            //   .getOne();
            const product = yield this.productRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.productImages', 'productImages')
                .leftJoinAndSelect('product.category', 'category')
                .where('product.id = :id', { id })
                .getOne();
            return product;
        });
    }
    getMyProducts(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.find({ where: { createdBy: user.userId }, relations: ['productImages'], order: { created_at: 'DESC' } });
        });
    }
    create(data, loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('creating product..');
            const user = yield this.userRepository.findOne(loggedUser.userId);
            const productItem = yield stripe_1.default.products.create({
                name: data.product_name,
                description: data.product_description,
            });
            console.log(data.product_name, data.product_description);
            console.log(productItem, 'productItem');
            const price = yield stripe_1.default.prices.create({
                unit_amount: Math.round(data.price * 100),
                currency: 'usd',
                product: productItem.id,
            });
            console.log(price, 'price');
            const planWithStripe = Object.assign(Object.assign({}, data), { stripe_product_id: productItem.id, stripe_price_id: price.id, created_by: loggedUser.userId });
            console.log(planWithStripe, 'planWithStripe');
            user.products += 1;
            yield this.userRepository.save(user);
            let product = yield this.productRepository.createproduct(planWithStripe);
            this.eventDispatcher.dispatch('onProductCreate', product);
            return product;
        });
    }
    updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.getRequestedProductOrFail(id);
            return yield this.productRepository.updateproduct(product, data);
        });
    }
    updateStatusById(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.productRepository.update(id, { status: status });
            return { message: `Status updated to ${status}` };
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.delete(id);
        });
    }
    getRequestedProductOrFail(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield this.productRepository.getOneById(id, resourceOptions);
            if (!product) {
                throw new CategoryNotFoundException_1.CategoryNotFoundException();
            }
            return product;
        });
    }
    getProductsBySearch(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSearchEmpty = !search || search.trim() === ',';
            const queryBuilder = this.productRepository.createQueryBuilder('Product');
            if (!isSearchEmpty) {
                const searchFields = ['product_name', 'product_description'];
                const orConditions = searchFields.map((field) => {
                    return `${field} LIKE :search`;
                });
                const whereClause = `(${orConditions.join(' OR ')})`;
                const searchValue = `%${search}%`;
                queryBuilder.andWhere(whereClause, { search: searchValue });
            }
            queryBuilder.select([
                'Product.id',
                'Product.product_name',
                'Product.product_description',
                'Product.price',
                'Product.stock',
                'Product.category',
                'Product.created_at',
            ]);
            const products = yield queryBuilder.getMany();
            if (!products) {
                throw new CategoryNotFoundException_1.CategoryNotFoundException();
            }
            return products;
        });
    }
    countProductsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.count({ where: { CreatedBy: userId } });
        });
    }
};
ProductService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(1, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(2, (0, EventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [ProductRepository_1.ProductRepository,
        UserRepository_1.UserRepository,
        EventDispatcher_1.EventDispatcherInterface])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map