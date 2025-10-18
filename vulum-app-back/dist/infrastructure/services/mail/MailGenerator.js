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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailGenerator = void 0;
const mailgen_1 = __importDefault(require("mailgen"));
const typedi_1 = require("typedi");
const app_1 = require("@base/config/app");
let MailGenerator = class MailGenerator {
    constructor() {
        this.mailGenerator = new mailgen_1.default({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: app_1.appConfig.name,
                link: app_1.appConfig.url,
            },
        });
    }
    generatePlaintext(params) {
        return this.mailGenerator.generatePlaintext(params);
    }
    generateHtmlContent(params) {
        return this.mailGenerator.generate(params);
    }
};
MailGenerator = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], MailGenerator);
exports.MailGenerator = MailGenerator;
//# sourceMappingURL=MailGenerator.js.map