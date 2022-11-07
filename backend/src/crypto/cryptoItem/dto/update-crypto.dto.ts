import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
export class UpdateCryptoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  idPortfolio: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  marker: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
