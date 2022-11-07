import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CurrencyFilterQueryDto {
  @ApiProperty({
    type: [String],
    required: false,
    format: 'form',
    description: 'Array of currency codes',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  currencyCodes?: string[];
}
