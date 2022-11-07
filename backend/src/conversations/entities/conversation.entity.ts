import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/dto/base.dto';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('conversations')
@Index(['creator.id', 'recipient.id'], { unique: true })
export class Conversation extends Base {
  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: UserEntity;

  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: UserEntity;

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  messages: Message[];

  @OneToOne(() => Message)
  @JoinColumn({ name: 'lastMessageSent' })
  lastMessageSent: Message;
}
