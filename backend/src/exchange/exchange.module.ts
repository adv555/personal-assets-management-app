import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { BanksModule } from './bank/banks.module';
import { ExchangeService } from './exchange.service';
import { RatesModule } from './rate/rates.module';
import { CurrenciesModule } from './currency/currencies.module';

@Module({
  imports: [BanksModule, RatesModule, CurrenciesModule],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class ExchangeModule {}
