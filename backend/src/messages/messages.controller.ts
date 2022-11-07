import { SkipThrottle } from '@nestjs/throttler';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('messages')
@SkipThrottle()
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiBody({ type: CreateMessageDto })
  async createMessage(
    @User() user: UserEntity,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const msg = await this.messagesService.createMessage({
      ...createMessageDto,
      user,
    });

    this.eventEmitter.emit('message.created', msg);

    return;
  }

  @Get(':conversationId')
  @ApiOperation({ summary: 'Get all messages in a conversation' })
  @ApiParam({ name: 'conversationId' })
  getMessagesFromConversation(
    @User() user: UserEntity,
    @Param('conversationId') conversationId: number,
  ) {
    return this.messagesService.getMessagesByConversationId(conversationId);
  }
}
