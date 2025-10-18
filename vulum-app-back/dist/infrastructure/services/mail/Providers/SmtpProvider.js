"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.SmtpProvider = void 0;
const nodeMailer = __importStar(require("nodemailer"));
const mail_1 = require("@base/config/mail");
class SmtpProvider {
    constructor() {
        this.fromValue = mail_1.mailConfig.fromName + ' ' + mail_1.mailConfig.authUser;
        this.transporter = nodeMailer.createTransport({
            host: mail_1.mailConfig.host,
            port: mail_1.mailConfig.port,
            auth: {
                user: mail_1.mailConfig.authUser,
                pass: mail_1.mailConfig.authPassword,
            },
        });
    }
    from(value) {
        this.fromValue = value;
        return this;
    }
    to(value) {
        this.toValue = value;
        return this;
    }
    subject(value) {
        this.subjectValue = value;
        return this;
    }
    text(value) {
        this.textValue = value;
        return this;
    }
    html(value) {
        this.htmlValue = value;
        return this;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: this.fromValue,
                to: this.toValue,
                subject: this.subjectValue,
                text: this.textValue,
                html: this.htmlValue,
            };
            return yield this.transporter.sendMail(mailOptions);
        });
    }
}
exports.SmtpProvider = SmtpProvider;
//# sourceMappingURL=SmtpProvider.js.map