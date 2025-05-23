import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '@api/models/Users/User';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userCount = await connection.getRepository(User).count();
    if (userCount === 0) {
      await factory(User)().createMany(10);
    } else {
      console.log('Users already exist. Skipping seeding...');
    }
  }
}
