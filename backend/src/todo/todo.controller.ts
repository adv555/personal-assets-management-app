import { SkipThrottle } from '@nestjs/throttler';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { AddTaskDto } from './dto/task/add-task.dto';
import { TaskViewDto } from './dto/task/task-view.dto';
import { TaskListViewDto } from './dto/task-list/task-list-view.dto';
import { TaskListService } from './task-list.service';
import { TaskService } from './task.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskListDto } from './dto/task-list/create-task-list.dto';
import { UpdateTaskListDto } from './dto/task-list/update-task-list.dto';
import { UpdateTaskDto } from './dto/task/update-task.dto';
import { User } from 'src/user/decorators/user.decorator';
import { GoalService } from './goal.service';
import { GoalViewDto } from './dto/goal/goal-view.dto';
import { AddGoalDto } from './dto/goal/add-goal.dto';

@SkipThrottle()
@Controller('todo-lists')
export class ToDoController {
  constructor(
    private readonly listService: TaskListService,
    private readonly taskService: TaskService,
    private readonly goalService: GoalService,
  ) {}

  @Get()
  @ApiResponse({ type: [TaskListViewDto] })
  async getAllLists(@User('id') userId: number): Promise<TaskListViewDto[]> {
    return (await this.listService.getLists(userId)).map((list) =>
      TaskListViewDto.fromEntity(list),
    );
  }

  @Post()
  @ApiResponse({ type: TaskListViewDto })
  async createList(
    @User('id') userId: number,
    @Body() dto: CreateTaskListDto,
  ): Promise<TaskListViewDto> {
    const newList = await this.listService.createList(dto.title, userId);
    return TaskListViewDto.fromEntity(newList);
  }

  @Put(':id')
  @ApiResponse({ type: TaskListViewDto })
  async updateList(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskListDto,
  ): Promise<TaskListViewDto> {
    if (await this.listService.doesListBelongToUser(userId, id)) {
      const list = await this.listService.updateList(dto.title, id);
      return TaskListViewDto.fromEntity(list);
    }
    throw new ForbiddenException(
      'It is forbidden to update a task list that does not belong to the current user.',
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async removeList(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    if (await this.listService.doesListBelongToUser(userId, id)) {
      await this.listService.removeList(id);
      return;
    }
    throw new ForbiddenException(
      'It is forbidden to delete a task list that does not belong to the current user.',
    );
  }

  @Get('/tasks/:id')
  @ApiResponse({ type: TaskViewDto })
  async getTask(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<TaskViewDto> {
    const task = await this.taskService.getTask(taskId);
    return TaskViewDto.fromEntity(task);
  }

  @Post(':listId/tasks')
  @ApiResponse({ type: TaskViewDto })
  async addTask(
    @User('id') userId: number,
    @Body() dto: AddTaskDto,
    @Param('listId', ParseIntPipe) listId: number,
  ): Promise<TaskViewDto> {
    if (await this.listService.doesListBelongToUser(userId, listId)) {
      const newTask = await this.taskService.addTask(listId, dto.description);
      return TaskViewDto.fromEntity(newTask);
    }
    throw new ForbiddenException(
      'It is forbidden to add a task to the list that do not belong to the current user.',
    );
  }

  @Post('/tasks/:taskId/goals')
  @ApiResponse({ type: GoalViewDto })
  async addGoalToTask(
    @User('id') userId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: AddGoalDto,
  ): Promise<GoalViewDto> {
    if (await this.taskService.doesTaskBelongToUser(userId, taskId)) {
      const goal = await this.goalService.addGoalToTask(
        taskId,
        dto.walletId,
        dto.goalBalance,
      );
      const taskIsDone = await this.goalService.everyGoalAchieved(taskId);
      return GoalViewDto.fromEntity(
        goal,
        taskId,
        taskIsDone,
        goal.isAchieved(),
      );
    }
    throw new ForbiddenException(
      'It is forbidden to add a goal to the task that do not belong to the current user.',
    );
  }

  @Put('tasks/:id')
  @ApiResponse({ type: TaskViewDto })
  async updateTask(
    @User('id') userId: number,
    @Body() dto: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskViewDto> {
    if (await this.taskService.doesTaskBelongToUser(userId, id)) {
      const task = await this.taskService.updateTask(
        id,
        dto.description,
        dto.isDone,
      );
      return TaskViewDto.fromEntity(task);
    }
    throw new ForbiddenException(
      'It is forbidden to update tasks from the list that does not belong to the current user.',
    );
  }

  @Delete('tasks/:id')
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  async removeTask(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    if (await this.taskService.doesTaskBelongToUser(userId, id)) {
      await this.taskService.removeTask(id);
      return;
    }
    throw new ForbiddenException(
      'It is forbidden to remove tasks from the list that do not belong to the current user.',
    );
  }
}
