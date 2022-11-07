import { Seeder } from '@jorgebodega/typeorm-seeding';
import { WalletFactory } from '../factories/wallet.factory';

export default class WalletSeeder extends Seeder {
  async run() {
    await new WalletFactory().createMany(5);
  }
}
