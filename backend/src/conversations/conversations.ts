import { UserEntity } from 'src/user/entities/user.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './entities/conversation.entity';

export interface IConversationsService {
  createConversation(
    user: UserEntity,
    createConversationDto: CreateConversationDto,
  );

  getConversations(id: number): Promise<Conversation[]>;

  findConversationById(id: number): Promise<Conversation>;
}
