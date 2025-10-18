"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedUser = void 0;
const routing_controllers_1 = require("routing-controllers");
function LoggedUser() {
    return (0, routing_controllers_1.createParamDecorator)({
        value: (action) => {
            return action.request.loggedUser;
        },
    });
}
exports.LoggedUser = LoggedUser;
//# sourceMappingURL=LoggedUser.js.map