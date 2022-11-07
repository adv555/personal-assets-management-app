import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In, LessThan, Repository } from 'typeorm';
import { subDays } from 'date-fns';
import { RateEntity } from './entities/rate.entity';
import { ExchangeRate } from './interfaces/rate';
import { BankEntity } from '../bank/entities/bank.entity';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { GetBankRatesResponseDto } from '../dto/get-bank-rates-response.dto';
import { GetCurrencyRatesResponseDto } from '../dto/get-currency-rates-response.dto';
import { GetExchangeRateHistoryResponseDto } from '../dto/get-exchange-rate-history-response.dto';
import { GetExchangeRateHistoryDto } from '../dto/get-exchange-rate-history.dto';
import { GetBankRatesDto } from '../dto/get-bank-rates.dto';

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);
  private readonly saveHistoryForNDays = 14;
  constructor(
    @InjectRepository(RateEntity)
    private readonly rateRepository: Repository<RateEntity>,
    @InjectRepository(BankEntity)
    private readonly bankRepository: Repository<BankEntity>,
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {}

  async createMany(exchangeRates: ExchangeRate[], bankName: string) {
    const currencies = await this.currencyRepository.find({
      where: [
        {
          currencyNumber: In(exchangeRates.map((rate) => rate.currencyNumber)),
        },
        { currencyCode: In(exchangeRates.map((rate) => rate.currencyCode)) },
      ],
    });

    const bank = await this.bankRepository.findOneBy({ name: bankName });

    if (!bank) {
      throw new HttpException(
        `Bank with name: ${bankName} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const rates = await Promise.all(
      exchangeRates.map(async (exchangeRateObject) => {
        const { currencyCode, currencyNumber, ...exchangeRate } =
          exchangeRateObject;
        const currency = currencies.find(
          (curr) =>
            curr.currencyNumber === currencyNumber ||
            curr.currencyCode === currencyCode,
        );

        if (!currency) {
          throw new HttpException(
            `Currency with code: ${currencyCode} or number: ${currencyNumber} doesn't find`,
            HttpStatus.NOT_FOUND,
          );
        }

        const rate = this.rateRepository.create(exchangeRate);
        rate.bank = bank;
        rate.currency = currency;

        return rate;
      }),
    );

    await this.rateRepository.insert(rates);
  }

  @Cron(CronExpression.EVERY_DAY_AT_5PM)
  async deleteOldRates() {
    const now = new Date();

    const [ratesForDelete, count] = await this.rateRepository.findAndCount({
      where: {
        createdAt: LessThan(subDays(now, this.saveHistoryForNDays)),
      },
    });

    await this.rateRepository.remove(ratesForDelete);

    this.logger.verbose(
      `Scheduled removal of rows from database. ${count} rows was deleted.`,
    );
  }

  async getRatesByBankId(
    bankId: number,
    query: GetBankRatesDto,
  ): Promise<GetBankRatesResponseDto[]> {
    const { offset, limit, currencyCodes } = query;
    // following statement return most recent rows from table 'rate' for each currency.
    return await this.rateRepository
      .createQueryBuilder('rate')
      .leftJoinAndSelect('rate.currency', 'currency')
      .distinctOn(['rate.currencyId'])
      .where((qb) => {
        qb.where('rate.bankId = :bankId', { bankId });
        !!currencyCodes &&
          qb.andWhere('currency.currencyCode IN (:...currencyCodes)', {
            currencyCodes,
          });
      })
      .orderBy({
        'rate.currencyId': 'DESC',
        'rate.created_at': 'DESC',
      })
      .offset(offset)
      .limit(limit)
      .getMany();
  }

  async getRatesByCurrencyId(
    currencyId: number,
    paginationQuery: PaginationQueryDto,
  ): Promise<GetCurrencyRatesResponseDto[]> {
    return await this.rateRepository
      .createQueryBuilder('rate')
      .leftJoinAndSelect('rate.bank', 'bank')
      .distinctOn(['rate.bankId'])
      .where('rate.currencyId = :currencyId', { currencyId })
      .orderBy({
        'rate.bankId': 'DESC',
        'rate.created_at': 'DESC',
      })
      .offset(paginationQuery.offset)
      .limit(paginationQuery.limit)
      .getMany();
  }

  async getExchangeRateHistory(
    currencyId: number,
    bankId: number,
    query: GetExchangeRateHistoryDto,
  ): Promise<GetExchangeRateHistoryResponseDto[]> {
    const where: FindOptionsWhere<RateEntity> = { bankId, currencyId };
    if (query.from && query.to) where.createdAt = Between(query.from, query.to);

    return await this.rateRepository.find({
      where,
      relations: {
        currency: true,
        bank: true,
      },
      take: query.limit,
      skip: query.offset,
    });
  }
}
