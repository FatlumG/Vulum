"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomErrorHandler = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
let CustomErrorHandler = class CustomErrorHandler {
    error(error, _req, res, _next) {
        const responseObject = {};
        responseObject.success = false;
        // Status code
        if (error instanceof routing_controllers_1.HttpError && error.httpCode) {
            responseObject.status = error.httpCode;
            res.status(error.httpCode);
        }
        else {
            responseObject.status = 500;
            res.status(500);
        }
        // Message
        responseObject.message = error.message;
        // Class validator handle errors
        if (responseObject.status == 400) {
            let validatorErrors = {};
            if (typeof error === 'object' && error.hasOwnProperty('errors')) {
                error.errors.forEach((element) => {
                    if (element.property && element.constraints) {
                        validatorErrors[element.property] = element.constraints;
                    }
                });
            }
            responseObject.errors = validatorErrors;
        }
        // Append stack
        if (error.stack && process.env.NODE_ENV === 'development' && responseObject.status == 500) {
            responseObject.stack = error.stack;
        }
        // Final response
        res.json(responseObject);
    }
};
CustomErrorHandler = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Middleware)({ type: 'after' })
], CustomErrorHandler);
exports.CustomErrorHandler = CustomErrorHandler;
//# sourceMappingURL=CustomErrorHandler.js.map