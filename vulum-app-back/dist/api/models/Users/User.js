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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const EntityBase_1 = require("@base/infrastructure/abstracts/EntityBase");
const class_transformer_1 = require("class-transformer");
const Role_1 = require("./Role");
const HashService_1 = require("@base/infrastructure/services/hash/HashService");
const Sale_1 = require("../Sales/Sale");
const Product_1 = require("../Products/Product");
const Pending_1 = require("../Pendings/Pending");
const Plan_1 = require("../Plans/Plan");
const Favorite_1 = require("../Favorites/Favorite");
const UserSubscription_1 = require("../Subscriptions/UserSubscription");
const Invoice_1 = require("../Invoices/Invoice");
let User = class User extends EntityBase_1.EntityBase {
    get fullName() {
        return this.first_name + ' ' + this.last_name;
    }
    hashPasswordBeforeInsert() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.password) {
                this.password = yield new HashService_1.HashService().make(this.password);
            }
        });
    }
    hashPasswordBeforeUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            // Hash only if the password is not already hashed
            if (this.password && !this.password.startsWith('$2b$')) {
                this.password = yield new HashService_1.HashService().make(this.password);
            }
        });
    }
    setDefaultRole() {
        return __awaiter(this, void 0, void 0, function* () {
            const roleId = this.role_id ? this.role_id : 5;
            this.role_id = roleId;
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profile_photo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Plan_1.Plan, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'pricing_plan' }),
    __metadata("design:type", Plan_1.Plan)
], User.prototype, "pricing_plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "favorites", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "pendings", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "todos", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 5 }),
    __metadata("design:type", Number)
], User.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Role_1.Role),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", Role_1.Role)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "stripe_customer_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'FullName' }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], User.prototype, "fullName", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPasswordBeforeInsert", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPasswordBeforeUpdate", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "setDefaultRole", null);
__decorate([
    (0, typeorm_1.OneToMany)(() => Sale_1.Sale, (sale) => sale.user_id),
    __metadata("design:type", Array)
], User.prototype, "salesList", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product_1.Product, (product) => product.createdBy),
    __metadata("design:type", Array)
], User.prototype, "productsList", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Pending_1.Pending, (pending) => pending.user_id),
    __metadata("design:type", Array)
], User.prototype, "pendingsList", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Favorite_1.Favorite, (favorite) => favorite.user_id),
    __metadata("design:type", Array)
], User.prototype, "favoritesList", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserSubscription_1.UserSubscription, (UserSubscription) => UserSubscription.usersList),
    __metadata("design:type", Array)
], User.prototype, "subscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Invoice_1.Invoice, (invoice) => invoice.user),
    __metadata("design:type", Invoice_1.Invoice)
], User.prototype, "invoices", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map