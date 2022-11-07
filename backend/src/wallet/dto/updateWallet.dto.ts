import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { WalletStatus } from '../enums/walletStatus.enum';

export class UpdateWalletDto {
  @ApiProperty({
    example: 'MyWallet',
    description: 'Wallet name',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Walletname can't be empti` })
  readonly wallet_name?: string;

  @ApiProperty({
    example: WalletStatus.OPEN,
    description: 'Wallet status',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Wallet status can't be empti` })
  @IsEnum(WalletStatus, {
    message: `Status should match ${WalletStatus.OPEN}|${WalletStatus.CLOSE}`,
  })
  readonly status?: WalletStatus;
}
