import { SchedulerRegistry, CronExpression } from '@nestjs/schedule';
import { CryptoEntity } from 'src/crypto/cryptoItem/entities/crypto.entity';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

import { CryptoPortfolioEntity } from './entities/cryptoPortfolio.entity';
import { HttpService } from '@nestjs/axios';
import { CryptoStatisticsService } from '../cryptoStatistics/cryptoStatistics.service';
import { CronJob } from 'cron';

@Injectable()
export class CryptoPortfolioService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CryptoPortfolioEntity)
    private cryptoPortfolioRepository: Repository<CryptoPortfolioEntity>,
    private httpService: HttpService,
    @InjectRepository(CryptoEntity)
    private cryptoRepository: Repository<CryptoEntity>,
    @Inject(forwardRef(() => CryptoStatisticsService))
    private statistics: CryptoStatisticsService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  async createPortfolio(idDto): Promise<CryptoPortfolioEntity> {
    const user = await this.userRepository.findOne({ where: { email: idDto } });

    if (!user) {
      throw new HttpException(
        `User with id: ${idDto} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const portfolio = this.cryptoPortfolioRepository.create({ owner: user });
    portfolio.owner = user;

    user.hasCryptoWallet = true;
    await this.userRepository.save(user);
    await this.cryptoPortfolioRepository.save(portfolio);
    await this.statistics.createStatisticsForWallet(portfolio);

    return portfolio;
  }

  async fetchAll(fetchItems: string[]) {
    const { data } = await this.httpService.axiosRef.get(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fetchItems.toString()}&tsyms=USD`,
    );

    return data;
  }

  async getPortfolio(email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['cryptoPortfolio'],
    });

    if (!user) {
      throw new HttpException('Portfolio does not exist', HttpStatus.NOT_FOUND);
    }

    const portfolio = await this.cryptoPortfolioRepository.findOne({
      where: { id: user.cryptoPortfolio.id },
      relations: ['cryptoItem', 'statistics'],
    });

    if (!portfolio) {
      throw new HttpException('Portfolio does not exist', HttpStatus.NOT_FOUND);
    }
    const fetchItems = [];
    portfolio?.cryptoItem?.forEach((el: any) => {
      fetchItems.push(el.marker);
    });

    const itemPrice = await this.fetchAll(fetchItems);

    const itemAll = { itemPrice, portfolio };

    return itemAll;
  }

  async removePortfolio(idUser: number, idPortfolio: number) {
    const portfolio = await this.cryptoPortfolioRepository.findOne({
      where: { id: idPortfolio },
      relations: ['owner'],
    });

    if (!portfolio) {
      throw new HttpException('Portfolio does not exist', HttpStatus.NOT_FOUND);
    }

    if (portfolio.owner.id !== idUser) {
      throw new HttpException('You are not an owner', HttpStatus.FORBIDDEN);
    }

    await this.cryptoPortfolioRepository.delete({ id: idPortfolio });
  }
}
