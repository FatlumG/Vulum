"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundException = void 0;
const routing_controllers_1 = require("routing-controllers");
class UserNotFoundException extends routing_controllers_1.NotFoundError {
    constructor() {
        super('User not found!');
    }
}
exports.UserNotFoundException = UserNotFoundException;
//# sourceMappingURL=UserNotFoundException.js.map