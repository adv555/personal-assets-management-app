import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { WalletLimitEntity } from '../../walletLimit/entities/walletLimit.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IncomeEntity } from '../../income/entities/income.entity';
import { CostEntity } from '../../costs/entities/cost.entity';
import { WalletStatus } from '../enums/walletStatus.enum';
import { WalletCurrency } from '../enums/walletCurrency.enum';
import { Base } from 'src/common/dto/base.dto';

@Entity('wallet')
export class WalletEntity extends Base {
  @ApiProperty({ example: 'My Wallet', description: 'Users wallet name' })
  @Column({ type: 'varchar', length: 50 })
  wallet_name: string;

  @ApiProperty({ example: 'open', description: 'Users wallet status' })
  @Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.OPEN })
  status: WalletStatus;

  @ManyToOne(() => UserEntity, (user) => user.wallet)
  userWallet: UserEntity;
  @ApiProperty({ example: 1000, description: 'Wallet total balance' })
  @Column({ type: 'int', default: 0 })
  total_balance: number;

  @ApiProperty({ example: 'UAH', description: 'Wallet currency' })
  @Column({ type: 'enum', enum: WalletCurrency, default: WalletCurrency.UAH })
  currency: WalletCurrency;

  @ManyToOne(() => UserEntity, (owner: UserEntity) => owner.wallets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @OneToMany(() => IncomeEntity, (income: IncomeEntity) => income.wallet, {
    onDelete: 'CASCADE',
  })
  income: IncomeEntity[];

  @OneToMany(() => CostEntity, (costs: CostEntity) => costs.wallet, {
    onDelete: 'CASCADE',
  })
  costs: CostEntity[];

  @ApiProperty()
  @OneToMany(
    () => WalletLimitEntity,
    (walletLimit: WalletLimitEntity) => walletLimit.wallet,
    {
      onDelete: 'CASCADE',
    },
  )
  walletLimits: WalletLimitEntity[];
}
