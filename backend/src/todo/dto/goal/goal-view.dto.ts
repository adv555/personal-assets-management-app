import { ApiProperty } from '@nestjs/swagger';
import { Goal } from 'src/todo/entities/goal.entity';

export class GoalViewDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  taskId: number;

  @ApiProperty()
  isTaskDone: boolean;

  @ApiProperty()
  walletId: number;

  @ApiProperty()
  goalBalance: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isAchieved: boolean;

  static fromEntity(
    entity: Goal,
    taskId: number,
    isTaskDone: boolean,
    isAchieved: boolean,
  ): GoalViewDto {
    const dto = new GoalViewDto();
    dto.id = entity.id;
    dto.taskId = entity.task?.id || taskId;
    dto.isTaskDone = entity.task?.isDone() || isTaskDone;
    dto.walletId = entity.wallet.id;
    dto.goalBalance = entity.goalBalance;
    dto.isAchieved = isAchieved;
    dto.description = entity.getDescription();
    return dto;
  }
}
