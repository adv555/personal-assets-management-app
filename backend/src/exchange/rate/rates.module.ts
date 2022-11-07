import { Module } from '@nestjs/common';

import { RatesService } from './rates.service';
import { RateEntity } from './entities/rate.entity';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { BankEntity } from '../bank/entities/bank.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([RateEntity, CurrencyEntity, BankEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
