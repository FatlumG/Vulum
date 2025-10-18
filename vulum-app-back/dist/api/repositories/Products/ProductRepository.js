"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.ProductRepository = void 0;
const Product_1 = require("@api/models/Products/Product");
const typeorm_1 = require("typeorm");
const RepositoryBase_1 = require("@base/infrastructure/abstracts/RepositoryBase");
let ProductRepository = class ProductRepository extends RepositoryBase_1.RepositoryBase {
    createproduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = new Product_1.Product();
            Object.assign(entity, data);
            return yield this.save(entity);
        });
    }
    updateproduct(product, data) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.assign(product, data);
            return yield product.save(data);
        });
    }
};
ProductRepository = __decorate([
    (0, typeorm_1.EntityRepository)(Product_1.Product)
], ProductRepository);
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map