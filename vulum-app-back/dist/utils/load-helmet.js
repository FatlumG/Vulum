"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadHelmet = void 0;
const helmet_1 = __importDefault(require("helmet"));
function loadHelmet(app) {
    return app.use((0, helmet_1.default)({
        /**
         * Default helmet policy + own customizations - graphiql support
         * https://helmetjs.github.io/
         */
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [
                    "'self'",
                    /** @by-us - adds graphiql support over helmet's default CSP */
                    "'unsafe-inline'",
                ],
                baseUri: ["'self'"],
                blockAllMixedContent: [],
                fontSrc: ["'self'", 'https:', 'data:'],
                frameAncestors: ["'self'"],
                imgSrc: ["'self'", 'data:'],
                objectSrc: ["'none'"],
                scriptSrc: [
                    "'self'",
                    /** @by-us - adds graphiql support over helmet's default CSP */
                    "'unsafe-inline'",
                    /** @by-us - adds graphiql support over helmet's default CSP */
                    "'unsafe-eval'",
                ],
                upgradeInsecureRequests: [],
            },
        },
    }));
}
exports.loadHelmet = loadHelmet;
//# sourceMappingURL=load-helmet.js.map