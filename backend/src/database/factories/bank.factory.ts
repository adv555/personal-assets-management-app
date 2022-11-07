import { Factory, FactorizedAttrs } from '@jorgebodega/typeorm-factory';

import dataSource from '../dataSource';
import { BankEntity } from '../../exchange/bank/entities/bank.entity';

export class BankFactory extends Factory<BankEntity> {
  protected entity = BankEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<BankEntity> {
    return {
      name: 'monobank',
      apiUrl: 'https://api.monobank.ua/bank/currency',
      rates: [],
    };
  }
}
