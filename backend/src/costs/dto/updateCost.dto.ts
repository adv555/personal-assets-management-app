import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { CostsCategories } from '../enums/costsCategory.enum';

export class UpdateCostDto {
  @ApiProperty({
    example: 'salary',
    description: 'Cost category',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Cost category can't be empti` })
  @IsEnum(CostsCategories)
  readonly category_name?: CostsCategories;

  @ApiProperty({
    example: 'My cost',
    description: 'Cost name',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Cost name can't be empti` })
  readonly cost_name?: string;

  @ApiProperty({
    example: 142,
    description: 'Cost sum is integer number',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly cost_sum?: number;

  @ApiProperty({
    example: '2022-09-07T11:44:17.300Z',
    description: 'Cost create date',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly createdAt?: Date;
}
