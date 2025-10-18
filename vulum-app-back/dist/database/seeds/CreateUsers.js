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
const User_1 = require("@api/models/Users/User");
class CreateUsers {
    run(factory, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCount = yield connection.getRepository(User_1.User).count();
            if (userCount === 0) {
                yield factory(User_1.User)().createMany(10);
            }
            else {
                console.log('Users already exist. Skipping seeding...');
            }
        });
    }
}
exports.default = CreateUsers;
//# sourceMappingURL=CreateUsers.js.map