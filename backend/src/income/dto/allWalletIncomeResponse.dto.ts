import { IncomeEntity } from '../entities/income.entity';
import { ApiProperty } from '@nestjs/swagger';
import { WalletEntity } from '../../wallet/entities/wallet.entity';

export class AllWalletIncomeResponseDto extends WalletEntity {
  @ApiProperty({ type: [IncomeEntity], description: `Wallet's income` })
  readonly income: IncomeEntity[];

  @ApiProperty({ example: 42, description: `Wallet's income count` })
  readonly income_count: number;
}
