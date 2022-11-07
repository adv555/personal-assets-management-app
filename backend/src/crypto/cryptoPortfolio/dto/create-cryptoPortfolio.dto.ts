import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCryptoPortfolioDto {
  @ApiProperty({ example: 'MyWallet', description: 'Wallet name' })
  @IsNotEmpty()
  @IsString()
  wallet_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  item: string;
}
