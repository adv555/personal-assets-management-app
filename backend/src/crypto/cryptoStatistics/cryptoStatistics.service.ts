import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoPortfolioEntity } from '../cryptoPortfolio/entities/cryptoPortfolio.entity';
import { CryptoStatisticsEntity } from './entity/cryptoStatistics.entity';

@Injectable()
export class CryptoStatisticsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(CryptoPortfolioEntity)
    private cryptoPortfolioRepository: Repository<CryptoPortfolioEntity>,
    @InjectRepository(CryptoStatisticsEntity)
    private statisticsRepository: Repository<CryptoStatisticsEntity>,
  ) {}

  async chengeDataOneDay(datas: string[]) {
    const { data } = await this.httpService.axiosRef.get(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${datas.toString()}&tsyms=USD`,
    );

    return data;
  }

  async createStatisticsForWallet(portfolio: CryptoPortfolioEntity) {
    const createNewStatistics = this.statisticsRepository.create({
      change1day: 0,
    });
    createNewStatistics.owner_crypto_wallet = portfolio;

    await this.statisticsRepository.save(createNewStatistics);
  }

  async chengeData(portfolio: CryptoPortfolioEntity) {
    const cryptoPortfolio = await this.cryptoPortfolioRepository.findOne({
      where: {
        id: portfolio.id,
      },
      relations: ['statistics', 'cryptoItem'],
    });

    if (
      !cryptoPortfolio.statistics ||
      cryptoPortfolio.cryptoItem.length === 0
    ) {
      throw new HttpException(
        'Error with statistics, pleas add new Item',
        HttpStatus.NOT_FOUND,
      );
    }

    const fetchItems = [];
    cryptoPortfolio?.cryptoItem?.forEach((el: any) => {
      fetchItems.push(el.marker);
    });

    const fetchData = await this.chengeDataOneDay(fetchItems);

    await this.saveDataInEntity(fetchData, cryptoPortfolio);
  }

  async saveDataInEntity(fetchData, cryptoPortfolio: CryptoPortfolioEntity) {
    const newFetchData = fetchData['RAW'];
    const newArr = [];
    for (const key in newFetchData) {
      newArr.push(newFetchData[key]['USD']);
    }

    const chengePercentOfDay = newArr.reduce((sum: number, el: any) => {
      return el.CHANGEPCT24HOUR + sum;
    }, 0);

    const chengePriceOfDay = newArr.reduce((sum: number, el: any) => {
      return el.PRICE + sum;
    }, 0);

    const statistics = await this.statisticsRepository.findOne({
      where: { id: cryptoPortfolio.statistics.id },
    });

    if (!statistics) {
      const createNewStatistics = this.statisticsRepository.create({
        change1day: chengePercentOfDay,
      });

      return await this.statisticsRepository.save(createNewStatistics);
    }
    statistics.counterDay++;
    statistics.totalPrice1Day = chengePriceOfDay;

    if (statistics.counterDay === 1) {
      statistics.one_day = chengePercentOfDay;
      statistics.totalPriceOneDay = chengePriceOfDay;
    }
    if (statistics.counterDay === 2) {
      statistics.two_day = chengePercentOfDay;
      statistics.totalPriceTwoDay = chengePriceOfDay;
    }
    if (statistics.counterDay === 3) {
      statistics.three_day = chengePercentOfDay;
      statistics.totalPriceThreeDay = chengePriceOfDay;
    }
    if (statistics.counterDay === 4) {
      statistics.four_day = chengePercentOfDay;
      statistics.totalPriceFourDay = chengePriceOfDay;
    }
    if (statistics.counterDay === 5) {
      statistics.five_day = chengePercentOfDay;
      statistics.totalPriceFiveDay = chengePriceOfDay;
    }
    if (statistics.counterDay === 6) {
      statistics.six_day = chengePercentOfDay;
      statistics.totalPriceSixDay = chengePriceOfDay;
    }
    if (statistics.counterDay === 7) {
      statistics.seven_day = chengePercentOfDay;
      statistics.totalPriceSevenDay = chengePriceOfDay;
    }
    if (statistics.counterDay > 7) {
      statistics.seven_day = statistics.six_day;
      statistics.six_day = statistics.five_day;
      statistics.five_day = statistics.four_day;
      statistics.four_day = statistics.three_day;
      statistics.three_day = statistics.two_day;
      statistics.two_day = statistics.one_day;
      statistics.one_day = chengePercentOfDay;
      statistics.totalPriceSevenDay = statistics.totalPriceSixDay;
      statistics.totalPriceSixDay = statistics.totalPriceFiveDay;
      statistics.totalPriceFiveDay = statistics.totalPriceFourDay;
      statistics.totalPriceFourDay = statistics.totalPriceThreeDay;
      statistics.totalPriceThreeDay = statistics.totalPriceTwoDay;
      statistics.totalPriceTwoDay = statistics.totalPriceOneDay;
      statistics.totalPriceOneDay = chengePriceOfDay;
    }
    statistics.change1day = chengePercentOfDay;
    statistics.changes7Day =
      Number(statistics.one_day) +
      Number(statistics.two_day) +
      Number(statistics.three_day) +
      Number(statistics.four_day) +
      Number(statistics.five_day) +
      Number(statistics.six_day) +
      Number(statistics.seven_day);

    statistics.totalPrice7Day =
      Number(statistics.totalPriceOneDay) +
      Number(statistics.totalPriceTwoDay) +
      Number(statistics.totalPriceThreeDay) +
      Number(statistics.totalPriceFourDay) +
      Number(statistics.totalPriceFiveDay) +
      Number(statistics.totalPriceSixDay) +
      Number(statistics.totalPriceSevenDay) / 7;

    await this.statisticsRepository.save(statistics);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async getAllPortfolioForStatistics() {
    const portfolios = await this.cryptoPortfolioRepository.find();

    portfolios.forEach(async (el) => await this.chengeData(el));
  }
}
