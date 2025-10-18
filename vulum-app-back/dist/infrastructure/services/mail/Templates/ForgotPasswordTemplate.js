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
exports.ForgotPasswordTemplate = void 0;
const typedi_1 = require("typedi");
const app_1 = require("@base/config/app");
const MailTemplateBase_1 = require("@base/infrastructure/abstracts/MailTemplateBase");
let ForgotPasswordTemplate = class ForgotPasswordTemplate extends MailTemplateBase_1.MailTemplateBase {
    constructor(username, token) {
        super();
        this.username = username;
        this.token = token;
    }
    getTemplate() {
        return {
            body: {
                name: this.username,
                intro: 'You have received this email because a password reset request for your account was received.',
                action: {
                    instructions: 'Click the button below to reset your password:',
                    button: {
                        color: '#DC4D2F',
                        text: 'Reset your password',
                        link: `${app_1.appConfig.url}/reset-password?token=${this.token}`,
                    },
                },
                outro: 'If you did not request a password reset, no further action is required on your part.',
            },
        };
    }
};
ForgotPasswordTemplate = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [String, String])
], ForgotPasswordTemplate);
exports.ForgotPasswordTemplate = ForgotPasswordTemplate;
//# sourceMappingURL=ForgotPasswordTemplate.js.map