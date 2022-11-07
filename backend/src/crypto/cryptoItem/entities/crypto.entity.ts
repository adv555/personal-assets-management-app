import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { Base } from 'src/common/dto/base.dto';
import { CryptoPortfolioEntity } from 'src/crypto/cryptoPortfolio/entities/cryptoPortfolio.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('cryptoItem')
export class CryptoEntity extends Base {
  @ApiProperty()
  @IsString()
  @Column({ default: ' ' })
  marker: string;

  @ApiProperty({ example: 10 })
  @Column({ default: 0, type: 'decimal' })
  amount: number;

  @ApiProperty({ example: 10 })
  @Column({ default: 0 })
  price: number;

  @ApiProperty({ example: 10 })
  @IsString()
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty()
  @IsString()
  @Column({ name: 'changes_day', default: 0 })
  changesDay?: string;

  @ApiProperty()
  @IsString()
  @Column({ name: 'changes_7_day', default: 0 })
  changes7Day?: string;

  @ApiProperty()
  @IsString()
  @Column({ name: 'changes_30_day', default: 0 })
  changes30Day?: string;

  @ApiProperty()
  @IsString()
  @Column()
  color: string;

  @ApiProperty()
  @ManyToOne(
    () => CryptoPortfolioEntity,
    (ownerWallet: CryptoPortfolioEntity) => ownerWallet.cryptoItem,
  )
  @JoinColumn({ name: 'owner_wallet' })
  ownerWallet: CryptoPortfolioEntity;
}
