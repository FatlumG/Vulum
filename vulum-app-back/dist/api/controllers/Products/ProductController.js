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
exports.ProductController = void 0;
const routing_controllers_1 = require("routing-controllers");
const ProductService_1 = require("@api/services/Products/ProductService");
const typedi_1 = require("typedi");
const CreateProductWithImagesRequest_1 = require("@api/requests/Products/CreateProductWithImagesRequest");
const AuthCheck_1 = require("@base/infrastructure/middlewares/Auth/AuthCheck");
const HasRole_1 = require("@base/infrastructure/middlewares/Auth/HasRole");
const ControllerBase_1 = require("@base/infrastructure/abstracts/ControllerBase");
const ProductUpdateRequest_1 = require("@api/requests/Products/ProductUpdateRequest");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const typeorm_simple_query_parser_1 = require("typeorm-simple-query-parser");
const LoggedUser_1 = require("@base/decorators/LoggedUser");
const ProductImagesService_1 = require("@api/services/ProductImages/ProductImagesService");
let ProductController = class ProductController extends ControllerBase_1.ControllerBase {
    constructor(productService, productImagesService) {
        super();
        this.productService = productService;
        this.productImagesService = productImagesService;
    }
    getAll(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.productService.getAll(resourceOptions);
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productService.findOneById(id);
        });
    }
    getAvailableProducts(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.productService.getAvailableProducts(resourceOptions);
        });
    }
    getPendingProducts(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.productService.getPendingProducts(resourceOptions);
        });
    }
    getUnavailableProducts(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.productService.getUnavailableProducts(resourceOptions);
        });
    }
    getSoldProducts(parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceOptions = parseResourceOptions.getAll();
            return yield this.productService.getSoldProducts(resourceOptions);
        });
    }
    getMyProducts(loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            // const resourceOptions = parseResourceOptions.getAll();
            return yield this.productService.getMyProducts(loggedUser);
        });
    }
    getByProductName(productName, parseResourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.productService.getProductsBySearch(productName);
        });
    }
    create(body, loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Controller is hit!');
            const createdProduct = yield this.productService.create(body.product, loggedUser);
            const imagesWithProductId = body.images.map((img) => (Object.assign(Object.assign({}, img), { product_id: Number(createdProduct.id) })));
            console.log('imagesWithProductId', imagesWithProductId);
            const createdImages = yield this.productImagesService.create(imagesWithProductId);
            console.log('createdImages', createdImages);
            console.log('createdProduct', createdProduct);
            return {
                product: createdProduct,
                images: createdImages,
            };
        });
    }
    update(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productService.updateOneById(id, product);
        });
    }
    updateStatus(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.productService.updateStatusById(id, body.status);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productService.deleteOneById(id);
        });
    }
    getImages(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productImagesService.getAll(resourceOptions);
        });
    }
    getImagesByProductId(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productImagesService.getImagesByProductId(id, resourceOptions);
        });
    }
};
__decorate([
    (0, routing_controllers_1.UseBefore)((0, HasRole_1.HasRole)(['Super Admin', 'Admin', 'Manager'])),
    (0, routing_controllers_1.Get)(),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id([0-9]+)'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getOne", null);
__decorate([
    (0, routing_controllers_1.Get)('/available-products'),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAvailableProducts", null);
__decorate([
    (0, routing_controllers_1.Get)('/pending-products'),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getPendingProducts", null);
__decorate([
    (0, routing_controllers_1.Get)('/unavailable-products'),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getUnavailableProducts", null);
__decorate([
    (0, routing_controllers_1.Get)('/sold-products'),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getSoldProducts", null);
__decorate([
    (0, routing_controllers_1.Get)('/my-products'),
    __param(0, (0, LoggedUser_1.LoggedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getMyProducts", null);
__decorate([
    (0, routing_controllers_1.Get)('/:productName([a-zA-Z]+)'),
    __param(0, (0, routing_controllers_1.Param)('productName')),
    __param(1, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeorm_simple_query_parser_1.RequestQueryParser]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getByProductName", null);
__decorate([
    (0, routing_controllers_1.Post)(),
    (0, routing_controllers_1.HttpCode)(201),
    __param(0, (0, routing_controllers_1.Body)()),
    __param(1, (0, LoggedUser_1.LoggedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductWithImagesRequest_1.CreateProductWithImagesRequest, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Put)('/:id'),
    (0, routing_controllers_1.UseBefore)((0, HasRole_1.HasRole)(['Super Admin', 'Admin', 'Manager'])),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ProductUpdateRequest_1.ProductUpdateRequest]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Patch)('/:id'),
    (0, routing_controllers_1.UseBefore)((0, HasRole_1.HasRole)(['Super Admin', 'Admin', 'Manager'])),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateStatus", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:id'),
    (0, routing_controllers_1.UseBefore)((0, HasRole_1.HasRole)(['Super Admin', 'Admin', 'Manager'])),
    (0, routing_controllers_1.HttpCode)(204),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "delete", null);
__decorate([
    (0, routing_controllers_1.Get)('/images'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getImages", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id([0-9]+)/images'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getImagesByProductId", null);
ProductController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_openapi_1.OpenAPI)({
        security: [{ bearerAuth: [] }],
    }),
    (0, routing_controllers_1.JsonController)('/products'),
    (0, routing_controllers_1.UseBefore)(AuthCheck_1.AuthCheck),
    __metadata("design:paramtypes", [ProductService_1.ProductService, ProductImagesService_1.ProductImagesService])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map