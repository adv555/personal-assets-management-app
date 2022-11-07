import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';
import { InvoiceDto } from './invoice.dto';

export class UpdateInvoiceDto extends InvoiceDto {
  @ApiProperty({
    example: 1,
    description: 'Invoice id',
  })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    example: '2022-10-13T10:25:29.402Z',
    description: 'Invoice creation date',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2022-10-13T10:25:29.402Z',
    description: 'Date of last account update',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: 'false',
    description: 'Invoice payment status',
  })
  @IsBoolean()
  paid: boolean;

  @ApiProperty({ description: 'creator', example: 'user@mail.com' })
  @IsNotEmpty()
  createdBy: UserEntity;
}
