import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IncomeEntity } from '../entities/income.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class AllUserIncomeResponseDto extends UserEntity {
  @ApiProperty({ type: [WalletEntity], description: `User's wallets` })
  readonly wallets: WalletEntity[];

  @ApiProperty({ type: [IncomeEntity], description: `User's income` })
  readonly income: IncomeEntity[];

  @ApiProperty({ example: 42, description: `User's income count` })
  readonly income_count: number;
}
