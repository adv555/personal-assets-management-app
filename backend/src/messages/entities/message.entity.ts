import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/dto/base.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity('messages')
export class Message extends Base {
  @ApiProperty({ example: 'Hello!', description: 'Conversation message' })
  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  author: UserEntity;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
