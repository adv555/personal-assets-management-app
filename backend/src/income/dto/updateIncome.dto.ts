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
import { IncomeCategories } from '../enums/incomesCategory.enum';

export class UpdateIncomeDto {
  @ApiProperty({
    example: 'salary',
    description: 'Income category',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Income category can't be empti` })
  @IsEnum(IncomeCategories)
  readonly category_name?: IncomeCategories;

  @ApiProperty({
    example: 'My income',
    description: 'Income name',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Income name can't be empti` })
  readonly income_name?: string;

  @ApiProperty({
    example: 700,
    description: 'Income sum is integer number',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly income_sum?: number;

  @ApiProperty({
    example: '2022-09-07T11:44:17.300Z',
    description: 'Income create date',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly createdAt?: Date;
}
