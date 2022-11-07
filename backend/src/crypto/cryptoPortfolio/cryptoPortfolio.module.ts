import { Module } from '@nestjs/common';
import { CryptoPortfolioService } from './cryptoPortfolio.service';
import { CryptoPortfolioController } from './cryptoPortfolio.controller';
import { CryptoPortfolioEntity } from './entities/cryptoPortfolio.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CryptoEntity } from '../cryptoItem/entities/crypto.entity';
import { CryptoStatisticsModule } from '../cryptoStatistics/cryptoStatistics.module';

@Module({
  controllers: [CryptoPortfolioController],
  providers: [CryptoPortfolioService],
  imports: [
    TypeOrmModule.forFeature([CryptoPortfolioEntity, UserEntity, CryptoEntity]),
    HttpModule,
    CryptoStatisticsModule,
  ],
})
export class CryptoPortfolioModule {}
