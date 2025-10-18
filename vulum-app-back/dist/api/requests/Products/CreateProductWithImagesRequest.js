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
exports.CreateProductWithImagesRequest = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const ProductCreateRequest_1 = require("./ProductCreateRequest");
const ProductImagesCreateRequest_1 = require("../ProductImages/ProductImagesCreateRequest");
class CreateProductWithImagesRequest {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ProductCreateRequest_1.ProductCreateRequest),
    __metadata("design:type", ProductCreateRequest_1.ProductCreateRequest)
], CreateProductWithImagesRequest.prototype, "product", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductImagesCreateRequest_1.ProductImagesCreateRequest),
    __metadata("design:type", Array)
], CreateProductWithImagesRequest.prototype, "images", void 0);
exports.CreateProductWithImagesRequest = CreateProductWithImagesRequest;
//# sourceMappingURL=CreateProductWithImagesRequest.js.map