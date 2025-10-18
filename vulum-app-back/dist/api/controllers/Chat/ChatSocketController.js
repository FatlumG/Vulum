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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocketController = void 0;
const socket_controllers_1 = require("socket-controllers");
const typedi_1 = require("typedi");
let ChatSocketController = class ChatSocketController {
    connection(socket) {
        console.log('Client connected.');
    }
    disconnect(socket) {
        console.log('Client disconnected.');
    }
    save(socket, message) {
        console.log('Received message: ', message);
        console.log('Setting id to the message and sending it back to the client.');
        message.id = 1;
        socket.emit('message-saved', message);
    }
};
__decorate([
    (0, socket_controllers_1.OnConnect)(),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatSocketController.prototype, "connection", null);
__decorate([
    (0, socket_controllers_1.OnDisconnect)(),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatSocketController.prototype, "disconnect", null);
__decorate([
    (0, socket_controllers_1.OnMessage)('save-message'),
    __param(0, (0, socket_controllers_1.SocketIO)()),
    __param(1, (0, socket_controllers_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatSocketController.prototype, "save", null);
ChatSocketController = __decorate([
    (0, typedi_1.Service)(),
    (0, socket_controllers_1.SocketController)()
], ChatSocketController);
exports.ChatSocketController = ChatSocketController;
//# sourceMappingURL=ChatSocketController.js.map