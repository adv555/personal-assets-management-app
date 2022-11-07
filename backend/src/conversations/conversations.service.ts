import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UserService } from '../user/user.service';
import { IConversationsService } from './conversations';
import { Message } from 'src/messages/entities/message.entity';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async getConversations(id: number): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.creator', 'creator')
      .addSelect([
        'creator.id',
        'creator.firstName',
        'creator.lastName',
        'creator.email',
        'creator.avatarPath',
      ])
      .leftJoin('conversation.recipient', 'recipient')
      .addSelect([
        'recipient.id',
        'recipient.firstName',
        'recipient.lastName',
        'recipient.email',
        'recipient.avatarPath',
      ])
      .leftJoinAndSelect('conversation.messages', 'messages')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .orderBy('messages.id', 'DESC')
      .getMany();
  }

  async findConversationById(id: number): Promise<Conversation> {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.creator', 'creator')
      .addSelect([
        'creator.id',
        'creator.firstName',
        'creator.lastName',
        'creator.email',
        'creator.avatarPath',
      ])
      .leftJoin('conversation.recipient', 'recipient')
      .addSelect([
        'recipient.id',
        'recipient.firstName',
        'recipient.lastName',
        'recipient.email',
        'recipient.avatarPath',
      ])
      .leftJoinAndSelect('conversation.messages', 'messages')
      .leftJoin('messages.author', 'author')
      .addSelect([
        'author.id',
        'author.firstName',
        'author.lastName',
        'author.email',
        'author.avatarPath',
      ])
      .where('conversation.id = :id', { id })
      .getOne();

    if (!conversation) {
      throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);
    }
    return conversation;
  }

  async createConversation(user: UserEntity, params: CreateConversationDto) {
    const { recipientId, message } = params;
    if (user.id === recipientId) {
      throw new HttpException(
        'You cannot send message to yourself',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingConversation = await this.conversationRepository.findOne({
      where: [
        {
          creator: { id: user.id },
          recipient: { id: recipientId },
        },
        {
          creator: { id: recipientId },
          recipient: { id: user.id },
        },
      ],
    });
    if (existingConversation) {
      throw new HttpException(
        'Conversation already exists',
        HttpStatus.CONFLICT,
      );
    }

    const recipient = await this.userService.findOne(recipientId);

    if (!recipient) {
      throw new HttpException('Recipient not found', HttpStatus.BAD_REQUEST);
    }
    const conversation = this.conversationRepository.create({
      creator: user,
      recipient,
    });

    await this.conversationRepository.save(conversation);

    const greetingMessage = this.messageRepository.create({
      content: message,
      conversation,
      author: user,
    });

    const savedMessage = await this.messageRepository.save(greetingMessage);

    conversation.lastMessageSent = savedMessage;

    return this.conversationRepository.save(conversation);
  }

  async filterConversationsBySearchTerm(
    conversations: Conversation[],
    searchTerm: string,
  ): Promise<Conversation[]> {
    return conversations.filter((conversation) => {
      const { creator, recipient } = conversation;
      const creatorName = `${creator.firstName} ${creator.lastName}`;
      const recipientName = `${recipient.firstName} ${recipient.lastName}`;
      return (
        creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }
}
