import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { BaseForCrypto } from 'src/common/dto/baseForCrypto.dto';
import { CryptoPortfolioEntity } from 'src/crypto/cryptoPortfolio/entities/cryptoPortfolio.entity';

import { Column, Entity, OneToOne } from 'typeorm';

@Entity('cryptoStatistics')
export class CryptoStatisticsEntity extends BaseForCrypto {
  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  one_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  two_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  three_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  four_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  five_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  six_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  seven_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  change1day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  counterDay?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ name: 'changes_7_day', default: 0, type: 'decimal' })
  changes7Day?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ default: 0, type: 'decimal' })
  totalPriceOneDay?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ default: 0, type: 'decimal' })
  totalPriceTwoDay?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ default: 0, type: 'decimal' })
  totalPriceThreeDay?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ default: 0, type: 'decimal' })
  totalPriceFourDay?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ default: 0, type: 'decimal' })
  totalPriceFiveDay?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ default: 0, type: 'decimal' })
  totalPriceSixDay?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ default: 0, type: 'decimal' })
  totalPriceSevenDay?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ default: 0, type: 'decimal' })
  totalPrice1Day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  totalPrice7Day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  changes30Day?: string;

  @OneToOne(
    () => CryptoPortfolioEntity,
    (owner_crypto_wallet: CryptoPortfolioEntity) =>
      owner_crypto_wallet.statistics,
  )
  owner_crypto_wallet?: CryptoPortfolioEntity;
}
