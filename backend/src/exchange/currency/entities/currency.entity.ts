import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from 'src/common/dto/base.dto';
import { RateEntity } from '../../rate/entities/rate.entity';

@Entity('currency')
export class CurrencyEntity extends Base {
  @ApiProperty({
    example: 'UAH',
    description: 'ISO 4217 currency alphabetic code',
  })
  @Column({ type: 'varchar', length: 3, unique: true })
  currencyCode: string;

  @ApiProperty({
    example: 980,
    description: 'ISO 4217 currency numeric code',
  })
  @Column({ type: 'int', unique: true })
  currencyNumber: number;

  @ApiProperty({
    example: 'Ukrainian hryvnia',
    description: 'Currency name',
  })
  @Column({ type: 'varchar' })
  currencyName: string;

  @OneToMany(() => RateEntity, (rate) => rate.currency)
  rates?: RateEntity[];
}
