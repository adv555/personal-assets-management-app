import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class DateFilterQueryDto {
  @ApiProperty({
    type: Date,
    required: false,
    description: 'From date',
  })
  @IsOptional()
  @ValidateIf((o) => o.to !== undefined)
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @ApiProperty({
    type: Date,
    required: false,
    description: 'End date',
  })
  @IsOptional()
  @ValidateIf((o) => o.from !== undefined)
  @Type(() => Date)
  @IsDate()
  to?: Date;
}
