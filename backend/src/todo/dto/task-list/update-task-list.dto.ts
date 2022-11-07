import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateTaskListDto } from './create-task-list.dto';

export class UpdateTaskListDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;
}
