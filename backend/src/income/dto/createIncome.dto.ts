import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { IncomeCategories } from '../enums/incomesCategory.enum';

export class CreateIncomeDto {
  @ApiProperty({ example: 'salary', description: 'Income category' })
  @IsNotEmpty({ message: `Income category can't be empti` })
  @IsEnum(IncomeCategories)
  readonly category_name: IncomeCategories;

  @ApiProperty({ example: 'My income', description: 'Income name' })
  @IsNotEmpty({ message: `Income name can't be empti` })
  readonly income_name: string;

  @ApiProperty({
    example: 700,
    description: 'Income sum is integer number',
  })
  @IsInt()
  @IsPositive()
  readonly income_sum: number;

  @ApiProperty({
    example: false,
    description: 'Is income transaction',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly is_transaction?: boolean;

  @ApiProperty({
    example: 42,
    description: 'From which user the transaction',
    required: false,
  })
  @IsOptional()
  @IsInt()
  readonly from_user_id?: number;
}
