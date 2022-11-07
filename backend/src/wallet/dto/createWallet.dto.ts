import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { WalletCurrency } from '../enums/walletCurrency.enum';

export class CreateWalletDto {
  @ApiProperty({ example: 'MyWallet', description: 'Wallet name' })
  @IsNotEmpty({ message: `Walletname can't be empti` })
  readonly wallet_name: string;

  @ApiProperty({ example: 'UAH', description: 'Wallet currency' })
  @IsNotEmpty({ message: `Currency can't be empti` })
  @IsEnum(WalletCurrency, {
    message: `Currency should match ${WalletCurrency.UAH}|${WalletCurrency.EUR}|${WalletCurrency.USD}`,
  })
  readonly currency: WalletCurrency;
}
