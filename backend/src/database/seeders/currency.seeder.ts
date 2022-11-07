import { Seeder } from '@jorgebodega/typeorm-seeding';
import getCurrencyData from '../data/currencies.data';
import { CurrencyFactory } from '../factories/currency.factory';
import { CurrencyEntity } from '../../exchange/currency/entities/currency.entity';

export default class CurrencySeeder extends Seeder {
  async run(dataSource) {
    await dataSource.getRepository(CurrencyEntity).delete({});
    const currencies = await Promise.all(
      getCurrencyData().map(
        async (currency) => await new CurrencyFactory().make(currency),
      ),
    );
    await dataSource.getRepository(CurrencyEntity).save(currencies);
  }
}
