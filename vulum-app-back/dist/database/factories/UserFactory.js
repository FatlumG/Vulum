"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_seeding_1 = require("typeorm-seeding");
const User_1 = require("@api/models/Users/User");
(0, typeorm_seeding_1.define)(User_1.User, (faker) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName).toLowerCase();
    const user = new User_1.User();
    user.first_name = firstName;
    user.last_name = lastName;
    user.email = email;
    user.password = 'password';
    return user;
});
//# sourceMappingURL=UserFactory.js.map