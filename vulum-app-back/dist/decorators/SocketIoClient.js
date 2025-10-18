"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIoClient = void 0;
const routing_controllers_1 = require("routing-controllers");
function SocketIoClient(options) {
    return (0, routing_controllers_1.createParamDecorator)({
        required: options && options.required ? true : false,
        value: (action) => {
            if (action.request.app) {
                return action.request.io;
            }
            return undefined;
        },
    });
}
exports.SocketIoClient = SocketIoClient;
//# sourceMappingURL=SocketIoClient.js.map