import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ example: 2, description: 'Recipient id' })
  @IsNumber()
  @IsNotEmpty()
  recipientId: number;

  @ApiProperty({ example: 'Hello!', description: 'Conversation message' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
