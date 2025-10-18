"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = void 0;
const routing_controllers_1 = require("routing-controllers");
class ForbiddenException extends routing_controllers_1.ForbiddenError {
    constructor() {
        super('Forbidden!');
    }
}
exports.ForbiddenException = ForbiddenException;
//# sourceMappingURL=ForbiddenException.js.map