"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailTemplateBase = void 0;
const MailGenerator_1 = require("../services/mail/MailGenerator");
class MailTemplateBase {
    getHtmlContent() {
        return new MailGenerator_1.MailGenerator().generateHtmlContent(this.getTemplate());
    }
}
exports.MailTemplateBase = MailTemplateBase;
//# sourceMappingURL=MailTemplateBase.js.map