import { Factory, FactorizedAttrs } from '@jorgebodega/typeorm-factory';

import dataSource from '../dataSource';
import { CurrencyEntity } from '../../exchange/currency/entities/currency.entity';

export class CurrencyFactory extends Factory<CurrencyEntity> {
  protected entity = CurrencyEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<CurrencyEntity> {
    return {
      currencyCode: 'USD',
      currencyNumber: 840,
      currencyName: 'U.S. dollar',
      rates: [],
    };
  }
}
