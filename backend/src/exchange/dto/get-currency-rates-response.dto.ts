import { ApiProperty } from '@nestjs/swagger';
import { RateEntity } from '../rate/entities/rate.entity';
import { BankEntity } from '../bank/entities/bank.entity';

export class GetCurrencyRatesResponseDto extends RateEntity {
  @ApiProperty({ type: BankEntity })
  readonly bank: BankEntity;
}
