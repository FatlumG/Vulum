"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentials = void 0;
const routing_controllers_1 = require("routing-controllers");
class InvalidCredentials extends routing_controllers_1.UnauthorizedError {
    constructor() {
        super('Invalid credentials!');
    }
}
exports.InvalidCredentials = InvalidCredentials;
//# sourceMappingURL=InvalidCredentials.js.map