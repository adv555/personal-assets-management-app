import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { Base } from 'src/common/dto/base.dto';
import { CostsCategories } from '../enums/costsCategory.enum';

@Entity('costs')
export class CostEntity extends Base {
  @ApiProperty({ example: 'salary', description: 'Income category' })
  @Column({
    type: 'enum',
    enum: CostsCategories,
    default: CostsCategories.OTHER,
  })
  category_name: CostsCategories;

  @ApiProperty({ example: 'My cost', description: 'Cost name' })
  @Column({ type: 'varchar', length: 50 })
  cost_name: string;

  @ApiProperty({
    example: 142,
    description: 'Cost sum is integer or decimal number',
  })
  @Column({ type: 'int', default: 0 })
  cost_sum: number;

  @ApiProperty({ example: null, description: 'Is income transaction' })
  @Column({ type: 'bool', default: false })
  is_transaction: boolean;

  @ManyToOne(
    () => UserEntity,
    (to_user: UserEntity) => to_user.costs_transactions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'to_user_id' })
  to_user: UserEntity;

  @ManyToOne(() => WalletEntity, (wallet: WalletEntity) => wallet.costs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;
}
