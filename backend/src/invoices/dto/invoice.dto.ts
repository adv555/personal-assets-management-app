import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsPositive,
  Max,
  IsInt,
  IsNotEmpty,
  ValidateNested,
  Min,
  IsOptional,
  IsDate,
  MinDate,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';
import { InvoiceItemDto } from './invoiceItem.dto';

export class InvoiceDto {
  @ApiProperty({ description: 'customer', example: 'user@mail.com' })
  @IsNotEmpty()
  billedTo: UserEntity;

  @ApiProperty({
    example: [
      { name: 'Phone 10x lite', amount: 2, price: 10000, subtotal: 20000 },
    ],
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @ApiProperty({
    example: 0,
    description: 'discount percentage',
  })
  @IsOptional()
  @Min(0)
  @Max(100)
  @IsInt()
  discount: number;

  @ApiProperty({
    example: '2022-09-30',
    description: 'billing date for payment',
  })
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  invoiceDate: Date;

  @ApiProperty({
    example: '2022-09-30',
    description: 'end date for payment',
  })
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  dueDate: Date;

  @ApiProperty({
    example: 'Details of invoice',
    description: 'details of invoice',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  invoiceDetails: string;

  @ApiProperty({
    example: 20000,
    description: 'total price of all items in invoice in coins',
  })
  @IsInt()
  @IsPositive()
  total: number;

  @ApiProperty({
    example: 'other',
    description: 'Expense category for the invoice',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  category: string;
}
