import { ApiProperty } from '@nestjs/swagger';
import { RateEntity } from '../rate/entities/rate.entity';
import { CurrencyEntity } from '../currency/entities/currency.entity';

export class GetBankRatesResponseDto extends RateEntity {
  @ApiProperty({ type: CurrencyEntity })
  readonly currency: CurrencyEntity;
}
