import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { createMessageParams, IMessageService } from './messages';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class MessagesService implements IMessageService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async createMessage(params: createMessageParams): Promise<Message> {
    const { user, conversationId, content } = params;

    const author = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.avatarPath',
      ])
      .where({ id: user.id })
      .getOne();

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
      .where({ id: conversationId })
      .getOne();

    if (!conversation) {
      throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);
    }

    const { creator, recipient } = conversation;
    if (creator.id !== user.id && recipient.id !== user.id) {
      throw new HttpException('Cannot Create Message', HttpStatus.FORBIDDEN);
    }

    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author,
    });

    const savedMessage = await this.messageRepository.save(newMessage);
    conversation.lastMessageSent = savedMessage;
    await this.conversationRepository.save(conversation);

    return savedMessage;
  }

  getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.author', 'author')
      .addSelect([
        'author.id',
        'author.firstName',
        'author.lastName',
        'author.email',
        'author.avatarPath',
      ])
      .where({ conversation: { id: conversationId } })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }
}
