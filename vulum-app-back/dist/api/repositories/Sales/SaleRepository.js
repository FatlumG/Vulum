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
exports.SaleRepository = void 0;
const Sale_1 = require("@api/models/Sales/Sale");
const typeorm_1 = require("typeorm");
const RepositoryBase_1 = require("@base/infrastructure/abstracts/RepositoryBase");
let SaleRepository = class SaleRepository extends RepositoryBase_1.RepositoryBase {
    createSale(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = new Sale_1.Sale();
            Object.assign(entity, data);
            return yield this.save(entity);
        });
    }
    updateSale(Sale, data) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.assign(Sale, data);
            return yield Sale.save(data);
        });
    }
};
SaleRepository = __decorate([
    (0, typeorm_1.EntityRepository)(Sale_1.Sale)
], SaleRepository);
exports.SaleRepository = SaleRepository;
//# sourceMappingURL=SaleRepository.js.map