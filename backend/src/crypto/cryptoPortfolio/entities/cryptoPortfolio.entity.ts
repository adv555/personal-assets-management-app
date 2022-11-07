import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { Base } from 'src/common/dto/base.dto';
import { CryptoEntity } from 'src/crypto/cryptoItem/entities/crypto.entity';
import { CryptoStatisticsEntity } from 'src/crypto/cryptoStatistics/entity/cryptoStatistics.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, OneToMany } from 'typeorm';

@Entity('cryptoPortfolio')
export class CryptoPortfolioEntity extends Base {
  @ApiProperty({ example: 1000, description: 'Wallet total balance' })
  @Column({ default: 0 })
  total_balance?: number;

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
  @OneToOne(
    () => CryptoStatisticsEntity,
    (statistics: CryptoStatisticsEntity) => statistics.owner_crypto_wallet,
  )
  @JoinColumn({ name: 'statistis_owner_id' })
  statistics: CryptoStatisticsEntity;

  @ApiProperty()
  @OneToOne(() => UserEntity, (owner: UserEntity) => owner.cryptoPortfolio)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @OneToMany(() => CryptoEntity, (cryptoItem) => cryptoItem.ownerWallet)
  @JoinColumn({ name: 'crypto_item' })
  cryptoItem?: CryptoEntity[];
}
