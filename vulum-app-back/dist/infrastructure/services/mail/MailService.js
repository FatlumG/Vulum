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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mail_1 = require("@base/config/mail");
const typedi_1 = require("typedi");
const SmtpProvider_1 = require("./Providers/SmtpProvider");
let MailService = class MailService {
    constructor() {
        this.setProvider(mail_1.mailConfig.provider);
    }
    setProvider(provider) {
        switch (provider) {
            case 'smtp':
                this.provider = new SmtpProvider_1.SmtpProvider();
                break;
            default:
                break;
        }
        return this;
    }
    from(value) {
        return this.provider.from(value);
    }
    to(value) {
        return this.provider.to(value);
    }
    subject(value) {
        return this.provider.subject(value);
    }
    text(value) {
        return this.provider.text(value);
    }
    html(value) {
        return this.provider.html(value);
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.send();
        });
    }
};
MailService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=MailService.js.map