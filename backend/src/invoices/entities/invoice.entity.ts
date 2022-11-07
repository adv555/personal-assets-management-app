import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { InvoiceItemEntity } from './invoiceItem.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/dto/base.dto';

@Entity('invoices')
export class InvoiceEntity extends Base {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  billedTo: UserEntity;

  @ApiProperty({
    example: [
      { name: 'Phone 10x lite', amount: 2, price: 10000, subtotal: 20000 },
    ],
  })
  @OneToMany(() => InvoiceItemEntity, (item) => item.invoice, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  items: InvoiceItemEntity[];

  @ApiProperty({ description: 'payment flag', example: false })
  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @ApiProperty({ description: 'discount' })
  @Column({ type: 'int', default: 0 })
  discount: number;

  @ApiProperty({ description: 'due date', example: '2022-09-29' })
  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @ApiProperty({ description: 'invoice date', example: '2022-09-31' })
  @Column({ type: 'timestamptz', nullable: true })
  invoiceDate: Date;

  @ApiProperty({ description: 'invoice details' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  invoiceDetails: string | null;

  @ApiProperty({ description: 'expense category for the invoice' })
  @Column({ type: 'varchar', length: 32, default: 'other' })
  category: string;

  @ApiProperty({ description: 'total invoice price', example: 20000 })
  @Column({ type: 'int', default: 0 })
  total: number;

  @ManyToMany(() => UserEntity, (user) => user.displayInvoices, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_invoices', // table name for the junction table of this relation
    joinColumn: {
      name: 'invoice',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  displayForUsers: UserEntity[];
}
