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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const EntityBase_1 = require("@base/infrastructure/abstracts/EntityBase");
const OrderItem_1 = require("../OrderItems/OrderItem");
const User_1 = require("../Users/User");
const PEnum_1 = require("./PEnum");
const ProductImage_1 = require("../ProductImages/ProductImage");
const Favorite_1 = require("../Favorites/Favorite");
const Category_1 = require("../Categories/Category");
let Product = class Product extends EntityBase_1.EntityBase {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "product_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "product_description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 8, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], Product.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PEnum_1.ProductStatus,
        default: PEnum_1.ProductStatus.PENDING,
    }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "stripe_price_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "stripe_product_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderItem_1.OrderItem, (orderItem) => orderItem.productsList),
    __metadata("design:type", Array)
], Product.prototype, "orderItemsList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.products),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", User_1.User)
], Product.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductImage_1.ProductImages, (productImages) => productImages.product_id),
    __metadata("design:type", Array)
], Product.prototype, "productImages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Favorite_1.Favorite, (favorite) => favorite.product_id),
    __metadata("design:type", Array)
], Product.prototype, "favoritesList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_1.Category, (category) => category.productsList),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Category_1.Category)
], Product.prototype, "category", void 0);
Product = __decorate([
    (0, typeorm_1.Entity)({ name: 'products' })
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map