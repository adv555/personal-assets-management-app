import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
