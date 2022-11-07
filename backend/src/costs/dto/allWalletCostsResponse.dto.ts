import { CostEntity } from '../entities/cost.entity';
import { ApiProperty } from '@nestjs/swagger';
import { WalletEntity } from '../../wallet/entities/wallet.entity';

export class AllWalletCostsResponseDto extends WalletEntity {
  @ApiProperty({ type: [CostEntity], description: `Wallet's costs` })
  readonly costs: CostEntity[];

  @ApiProperty({ example: 42, description: `Wallet's costs count` })
  readonly costs_count: number;
}
