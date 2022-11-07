import { ApiProperty } from '@nestjs/swagger';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from 'src/common/dto/base.dto';

@Entity('walletLimit')
export class WalletLimitEntity extends Base {
  @ManyToOne(
    () => WalletEntity,
    (wallet: WalletEntity) => wallet.walletLimits,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;

  @ApiProperty({
    example: 5000,
    description: 'Amount costs for target duration',
  })
  @Column({ type: 'int', default: 0 })
  wallet_limit: number;

  @ApiProperty({ example: 30, description: 'Amount of days for sum costs' })
  @Column({ type: 'int', default: 30 })
  wallet_duration: number;
}
