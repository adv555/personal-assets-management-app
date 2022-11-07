import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 1, description: 'Conversation id' })
  @IsNotEmpty()
  @IsNumber()
  conversationId: number;

  @ApiProperty({ example: 'Hello!', description: 'Conversation message' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
