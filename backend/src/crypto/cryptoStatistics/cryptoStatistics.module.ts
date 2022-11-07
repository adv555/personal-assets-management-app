import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoEntity } from '../cryptoItem/entities/crypto.entity';
import { CryptoPortfolioEntity } from '../cryptoPortfolio/entities/cryptoPortfolio.entity';
import { cryptoStatisticsCotroller } from './cryptoStatistics.controller';
import { CryptoStatisticsService } from './cryptoStatistics.service';
import { CryptoStatisticsEntity } from './entity/cryptoStatistics.entity';

@Module({
  controllers: [cryptoStatisticsCotroller],
  providers: [CryptoStatisticsService],
  imports: [
    TypeOrmModule.forFeature([
      CryptoPortfolioEntity,
      CryptoEntity,
      CryptoStatisticsEntity,
    ]),
    HttpModule,
  ],
  exports: [CryptoStatisticsService],
})
export class CryptoStatisticsModule {}
