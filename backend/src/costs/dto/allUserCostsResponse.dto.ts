import { CostEntity } from '../entities/cost.entity';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

export class AllUserCostsResponseDto extends UserEntity {
  @ApiProperty({ type: [WalletEntity], description: `User's wallets` })
  readonly wallets: WalletEntity[];

  @ApiProperty({ type: [CostEntity], description: `User's costs` })
  readonly costs: CostEntity[];

  @ApiProperty({ example: 42, description: `User's costs count` })
  readonly costs_count: number;
}
