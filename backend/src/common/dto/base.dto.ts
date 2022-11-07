import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Base {
  @ApiProperty({ example: '42', description: 'Unique Id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2022-10-06T08:00:00.686Z',
    description: 'Created at date',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2022-15-06T09:40:00.686Z',
    description: 'Created at date',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
