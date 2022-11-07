import { Factory, FactorizedAttrs } from '@jorgebodega/typeorm-factory';
import { faker } from '@faker-js/faker';
import { genSalt, hash } from 'bcryptjs';

import { UserEntity } from '../../user/entities/user.entity';
import dataSource from '../dataSource';

const avatarIcons = [
  '/v1666726379/MyFinance/rmzy5jhymvtytftaxzvg.webp',
  '/v1666726320/MyFinance/nbyyiskeyvv0ptteatnv.webp',
  '/v1666458967/MyFinance/urmfadfg5hdkjnbfyt8v.webp',
  '/v1666458942/MyFinance/sh6igagcsabeqjpwbur7.webp',
  '/v1666727294/MyFinance/vwceqtamgh2lnqsifqai.webp',
  '/v1666600424/MyFinance/dp0c2aw4daruxojetazi.webp',
  '/v1666550101/MyFinance/pdgzuqsvehcok23oagpa.webp',
  '/v1665067382/MyFinance/wcsnw5zd4mz5g3m1zjj5.webp',
  '/v1666170953/MyFinance/ybqcvjjtzdjg7lmbyfzd.webp',
  '/v1666772006/MyFinance/d0xiykex981f9zi9rq9j.webp',
];

export class UserFactory extends Factory<UserEntity> {
  protected entity = UserEntity;
  protected dataSource = dataSource;
  protected attrs(): FactorizedAttrs<UserEntity> {
    return {
      isVerified: true,
      refreshTokenHash: '',
      firstName: faker.name.firstName,
      lastName: faker.name.lastName,
      email: () => faker.internet.email().toLowerCase(),
      password: async () => await hash('Test@123', await genSalt(3)),
      address: faker.address.streetAddress(true),
      phone: faker.phone.number('+380#########'),
      birthdate: faker.date.birthdate(),
      activationLink: faker.random.alphaNumeric(64),
      avatarPath: avatarIcons[Math.floor(Math.random() * avatarIcons.length)],

      wallets: [],
      income_transactions: [],
      costs_transactions: [],
    };
  }
}
