import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Number of items to return',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Number of items to skip',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  offset: number;
}
