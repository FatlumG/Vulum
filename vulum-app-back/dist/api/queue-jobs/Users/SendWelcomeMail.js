"use strict";
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
exports.SendWelcomeMail = void 0;
const QueueJobBase_1 = require("@base/infrastructure/abstracts/QueueJobBase");
class SendWelcomeMail extends QueueJobBase_1.QueueJobBase {
    /**
     * Create a new job instance.
     */
    constructor(data) {
        super(data);
    }
    /**
     * Execute the job.
     */
    handle(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = job.data;
            console.log('Recieved job', job.name);
            console.log(user);
        });
    }
}
exports.SendWelcomeMail = SendWelcomeMail;
//# sourceMappingURL=SendWelcomeMail.js.map