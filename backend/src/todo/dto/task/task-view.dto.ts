import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../../entities/task.entity';
import { GoalViewDto } from '../goal/goal-view.dto';

export class TaskViewDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty({
    default: false,
  })
  isDone: boolean;

  @ApiProperty()
  listId: number;

  @ApiProperty()
  goals: GoalViewDto[];

  static fromEntity(task: Task, listId?: number): TaskViewDto {
    const dto = new TaskViewDto();
    dto.id = task.id;
    dto.description = task.description;
    dto.isDone = task.isDone();
    dto.listId = task.list?.id || listId;
    dto.goals = !task.goals
      ? []
      : task.goals.map((g) =>
          GoalViewDto.fromEntity(g, task.id, task.isDone(), g.isAchieved()),
        );
    return dto;
  }
}
