import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CurrencyEntity } from './entities/currency.entity';
import { CurrencyFilterQueryDto } from '../dto/currency-filter-query.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {}

  async getAll(filter: CurrencyFilterQueryDto): Promise<CurrencyEntity[]> {
    const { currencyCodes } = filter;
    return await this.currencyRepository
      .createQueryBuilder('currency')
      .innerJoin('currency.rates', 'rates')
      .distinctOn(['currency."currencyCode"'])
      .where((qb) => {
        !!currencyCodes &&
          qb.where('currency.currencyCode IN (:...currencyCodes)', {
            currencyCodes,
          });
      })
      .getMany();
  }
}
