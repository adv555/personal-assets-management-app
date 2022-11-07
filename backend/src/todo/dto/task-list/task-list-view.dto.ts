import { ApiProperty } from '@nestjs/swagger';
import { TaskList } from '../../entities/task-list.entity';
import { TaskViewDto } from '../task/task-view.dto';

export class TaskListViewDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [TaskViewDto] })
  tasks: TaskViewDto[];

  static fromEntity(list: TaskList): TaskListViewDto {
    const dto = new TaskListViewDto();
    dto.id = list.id;
    dto.createdAt = list.createdAt;
    dto.title = list.title;
    dto.tasks = list.tasks.map((task) => TaskViewDto.fromEntity(task, list.id));
    return dto;
  }
}
