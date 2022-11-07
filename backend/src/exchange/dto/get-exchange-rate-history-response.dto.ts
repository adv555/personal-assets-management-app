import { ApiProperty } from '@nestjs/swagger';
import { RateEntity } from '../rate/entities/rate.entity';
import { BankEntity } from '../bank/entities/bank.entity';
import { CurrencyEntity } from '../currency/entities/currency.entity';

export class GetExchangeRateHistoryResponseDto extends RateEntity {
  @ApiProperty({ type: BankEntity })
  readonly bank: BankEntity;

  @ApiProperty({ type: CurrencyEntity })
  readonly currency: CurrencyEntity;
}
