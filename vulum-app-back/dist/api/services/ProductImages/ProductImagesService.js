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
exports.ProductImagesService = void 0;
const typedi_1 = require("typedi");
const ProductImagesRepository_1 = require("@api/repositories/ProductImages/ProductImagesRepository");
const CategoryNotFoundException_1 = require("@api/exceptions/Categories/CategoryNotFoundException");
const EventDispatcher_1 = require("@base/decorators/EventDispatcher");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
let ProductImagesService = class ProductImagesService {
    constructor(productImagesRepository, eventDispatcher) {
        this.productImagesRepository = productImagesRepository;
        this.eventDispatcher = eventDispatcher;
        //
    }
    getAll(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            // return await this.productImagesRepository.getManyAndCount(resourceOptions);
            return yield this.productImagesRepository.find(Object.assign({}, resourceOptions));
        });
    }
    getImagesByProductId(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getRequestedProductImagesOrFail(id, resourceOptions);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let productImages = yield this.productImagesRepository.createProductImages(data);
            this.eventDispatcher.dispatch('onProductImagesCreate', productImages);
            return productImages;
        });
    }
    updateOneById(product_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const productImages = yield this.getAll({ where: { product_id } });
            if (!productImages) {
                throw new CategoryNotFoundException_1.CategoryNotFoundException();
            }
            this.eventDispatcher.dispatch('onProductImagesUpdate', productImages);
            return productImages;
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productImagesRepository.delete(id);
        });
    }
    // public async getMyProductImagess(loggedUser: LoggedUserInterface, resourceOptions?: object) {
    //   return await this.orderRepository.find({
    //     where: { created_by: loggedUser.userId, status: 'productImages' },
    //     ...resourceOptions,
    //   });
    // }
    getRequestedProductImagesOrFail(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let productImages = yield this.productImagesRepository.getOneById(id, resourceOptions);
            if (!productImages) {
                throw new CategoryNotFoundException_1.CategoryNotFoundException();
            }
            return productImages;
        });
    }
};
ProductImagesService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(1, (0, EventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [ProductImagesRepository_1.ProductImagesRepository,
        EventDispatcher_1.EventDispatcherInterface])
], ProductImagesService);
exports.ProductImagesService = ProductImagesService;
//# sourceMappingURL=ProductImagesService.js.map