import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/auth/middleware/auth.middleware';

import { Conversation } from 'src/conversations/entities/conversation.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation, UserEntity])],

  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(MessagesController);
  }
}
