import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { CostsCategories } from '../enums/costsCategory.enum';

export class CreateCostDto {
  @ApiProperty({ example: 'salary', description: 'Income category' })
  @IsNotEmpty({ message: `Income category can't be empti` })
  @IsEnum(CostsCategories)
  readonly category_name: CostsCategories;

  @ApiProperty({ example: 'My cost', description: 'Cost name' })
  @IsNotEmpty({ message: `Cost name can't be empti` })
  readonly cost_name: string;

  @ApiProperty({
    example: 154,
    description: 'Cost sum is integer number',
  })
  @IsInt()
  @IsPositive()
  readonly cost_sum: number;

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
    description: 'To which user the transaction',
    required: false,
  })
  @IsOptional()
  @IsInt()
  readonly to_user_id?: number;
}
