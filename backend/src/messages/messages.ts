import { Message } from './entities/message.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export interface createMessageParams {
  conversationId: number;
  content: string;
  user: UserEntity;
}

export interface IMessageService {
  createMessage(params: createMessageParams): Promise<Message>;
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
}
