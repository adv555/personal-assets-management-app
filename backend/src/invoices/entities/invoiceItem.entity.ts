import { Column, Entity, ManyToOne } from 'typeorm';
import { InvoiceEntity } from './invoice.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/dto/base.dto';

@Entity('invoice_item')
export class InvoiceItemEntity extends Base {
  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.items)
  invoice: InvoiceEntity;

  @ApiProperty({ description: 'item name' })
  @Column({ type: 'varchar', length: 64 })
  name: string;

  @ApiProperty({ description: 'quantity of items' })
  @Column({ type: 'int', default: 0 })
  amount: number;

  @ApiProperty({ description: 'price of item' })
  @Column({ type: 'int', default: 0 })
  price: number;

  @ApiProperty({ description: 'total price of items' })
  @Column({ type: 'int', default: 0 })
  subTotal: number;
}
