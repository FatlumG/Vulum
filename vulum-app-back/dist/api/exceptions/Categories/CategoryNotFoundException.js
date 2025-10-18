"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryNotFoundException = void 0;
const routing_controllers_1 = require("routing-controllers");
class CategoryNotFoundException extends routing_controllers_1.NotFoundError {
    constructor() {
        super('Category not found!');
    }
}
exports.CategoryNotFoundException = CategoryNotFoundException;
//# sourceMappingURL=CategoryNotFoundException.js.map