import { Seeder } from '@jorgebodega/typeorm-seeding';
import { BankFactory } from '../factories/bank.factory';
import { BankEntity } from '../../exchange/bank/entities/bank.entity';
import getBanksData from '../data/banks.data';

export default class BankSeeder extends Seeder {
  async run(dataSource) {
    await dataSource.getRepository(BankEntity).delete({});
    const banks = await Promise.all(
      getBanksData().map(async (bank) => await new BankFactory().make(bank)),
    );

    await dataSource.getRepository(BankEntity).save(banks);
  }
}
