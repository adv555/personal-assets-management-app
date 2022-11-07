import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { Base } from 'src/common/dto/base.dto';
import { IncomeCategories } from '../enums/incomesCategory.enum';

@Entity('income')
export class IncomeEntity extends Base {
  @ApiProperty({ example: 'salary', description: 'Income category' })
  @Column({
    type: 'enum',
    enum: IncomeCategories,
    default: IncomeCategories.OTHER,
  })
  category_name: IncomeCategories;

  @ApiProperty({ example: 'My income', description: 'Income name' })
  @Column({ type: 'varchar', length: 50 })
  income_name: string;

  @ApiProperty({
    example: 555,
    description: 'Income sum is integer or decimal number',
  })
  @Column({ type: 'int', default: 0 })
  income_sum: number;

  @ApiProperty({ example: null, description: 'Is income transaction' })
  @Column({ type: 'bool', default: false })
  is_transaction: boolean;

  @ManyToOne(
    () => UserEntity,
    (from_user: UserEntity) => from_user.income_transactions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'from_user_id' })
  from_user: UserEntity;

  @ManyToOne(() => WalletEntity, (wallet: WalletEntity) => wallet.income, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;
}
