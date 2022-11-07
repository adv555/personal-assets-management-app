import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from '../user/decorators/user.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Conversation } from './entities/conversation.entity';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('conversations')
@SkipThrottle()
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiBody({ type: CreateConversationDto })
  @ApiCreatedResponse({
    description: 'The conversations have been successfully created.',
    type: [CreateConversationDto],
  })
  @ApiBadRequestResponse({
    description: 'The user is not authenticated',
  })
  @ApiNotFoundResponse({
    description: 'Recipient not found',
  })
  async createConversation(
    @User() user: UserEntity,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.createConversation(
      user,
      createConversationDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all User conversations' })
  async getConversations(@User() user: UserEntity) {
    const conversations = await this.conversationsService.getConversations(
      user.id,
    );

    return conversations;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by Id' })
  @ApiOkResponse({
    description: 'The conversation has been successfully found.',
    type: Conversation,
  })
  @ApiParam({ name: 'id', type: Number })
  async getConversationById(@Param('id') id: number): Promise<Conversation> {
    const conversation = await this.conversationsService.findConversationById(
      id,
    );
    return conversation;
  }
}
