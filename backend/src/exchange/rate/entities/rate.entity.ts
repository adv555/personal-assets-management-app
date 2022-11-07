import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from 'src/common/dto/base.dto';
import { BankEntity } from '../../bank/entities/bank.entity';
import { CurrencyEntity } from '../../currency/entities/currency.entity';

@Entity('rate')
export class RateEntity extends Base {
  @ApiProperty({ example: 36.25, description: 'Exchange rate for sell' })
  @Column({ type: 'decimal', nullable: true })
  sellRate?: number;

  @ApiProperty({ example: 37.12, description: 'Exchange rate for buy' })
  @Column({ type: 'decimal', nullable: true })
  buyRate?: number;

  @ApiProperty({
    example: 36.1,
    description:
      'Cross exchange rate, if selling and buying rate not presented',
  })
  @Column({ type: 'decimal', nullable: true })
  crossRate?: number;

  @ManyToOne(() => BankEntity, (bank) => bank.rates)
  bank!: BankEntity;

  @ApiProperty({
    example: 16,
    description: 'The ID of bank that provides the exchange rate',
  })
  @Column({ nullable: true })
  bankId: number;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.rates)
  currency!: CurrencyEntity;

  @ApiProperty({
    example: 345,
    description: 'The ID of currency',
  })
  @Column({ nullable: true })
  currencyId: number;
}
