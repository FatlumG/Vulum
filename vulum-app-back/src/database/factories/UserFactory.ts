import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '@api/models/Users/User';

define(User, (faker: typeof Faker) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName).toLowerCase();

  const user = new User();
  user.FName = firstName;
  user.LName = lastName;
  user.Email = email;
  user.Password = 'password';

  return user;
});
