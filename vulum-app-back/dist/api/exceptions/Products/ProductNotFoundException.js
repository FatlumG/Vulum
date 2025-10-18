"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductNotFoundException = void 0;
const routing_controllers_1 = require("routing-controllers");
class ProductNotFoundException extends routing_controllers_1.NotFoundError {
    constructor() {
        super('Product not found!');
    }
}
exports.ProductNotFoundException = ProductNotFoundException;
//# sourceMappingURL=ProductNotFoundException.js.map