import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { AddTaskDto } from './add-task.dto';

export class UpdateTaskDto extends AddTaskDto {
  @ApiProperty()
  @IsBoolean()
  isDone: boolean;
}
