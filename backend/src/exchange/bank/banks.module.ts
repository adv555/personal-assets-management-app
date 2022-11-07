import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import banksConfig from './banks.config';
import { MonobankService } from './services/monobank.service';
import { PrivatbankService } from './services/privatbank.service';
import { NbuService } from './services/nbu.service';
import { RatesModule } from '../rate/rates.module';
import { BanksService } from './services/banks.service';
import { BankEntity } from './entities/bank.entity';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([BankEntity]),
    ConfigModule.forRoot({
      load: [banksConfig],
    }),
    RatesModule,
  ],
  providers: [BanksService, NbuService, MonobankService, PrivatbankService],
  exports: [BanksService],
})
export class BanksModule {}
