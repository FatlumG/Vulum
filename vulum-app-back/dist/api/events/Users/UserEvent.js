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
exports.UserEvent = void 0;
const event_dispatch_1 = require("event-dispatch");
const SendWelcomeMail_1 = require("@api/queue-jobs/Users/SendWelcomeMail");
let UserEvent = class UserEvent {
    onUserRegister(user) {
        new SendWelcomeMail_1.SendWelcomeMail(user).setOptions({ delay: 5000 }).dispatch();
    }
    onUserCreate(user) {
        console.log('User ' + user.email + ' created!');
    }
};
__decorate([
    (0, event_dispatch_1.On)('onUserRegister'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserEvent.prototype, "onUserRegister", null);
__decorate([
    (0, event_dispatch_1.On)('onUserCreate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserEvent.prototype, "onUserCreate", null);
UserEvent = __decorate([
    (0, event_dispatch_1.EventSubscriber)()
], UserEvent);
exports.UserEvent = UserEvent;
//# sourceMappingURL=UserEvent.js.map