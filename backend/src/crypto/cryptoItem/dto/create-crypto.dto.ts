import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
export class CreateCryptoDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  marker: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  imageUrl: string;
}
