import { Seeder } from '@jorgebodega/typeorm-seeding';
import { UserFactory } from '../factories/user.factory';
export default class UserSeeder extends Seeder {
  async run() {
    await new UserFactory().createMany(10);
  }
}
