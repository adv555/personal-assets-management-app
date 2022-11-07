import { faker } from '@faker-js/faker';
import { WalletCurrency } from '../../wallet/enums/walletCurrency.enum';
import { WalletStatus } from '../../wallet/enums/walletStatus.enum';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import dataSource from '../dataSource';
import {
  Factory,
  FactorizedAttrs,
  SingleSubfactory,
  LazyInstanceAttribute,
} from '@jorgebodega/typeorm-factory';
import { UserFactory } from './user.factory';

export class WalletFactory extends Factory<WalletEntity> {
  protected entity = WalletEntity;
  protected dataSource = dataSource;
  protected attrs(): FactorizedAttrs<WalletEntity> {
    return {
      wallet_name: 'Main',
      status: WalletStatus.OPEN,
      total_balance: +faker.finance.amount(0, 50000, 0),
      currency: WalletCurrency.UAH,
      income: [],
      costs: [],
      owner: new LazyInstanceAttribute(
        (instance) =>
          new SingleSubfactory(UserFactory, { wallets: [instance] }),
      ),
    };
  }
}
