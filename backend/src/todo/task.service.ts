import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskListService } from './task-list.service';

export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly listService: TaskListService,
  ) {}

  async getTask(taskId): Promise<Task> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.list', 'list')
      .leftJoinAndSelect('task.goals', 'goals')
      .where('task.id = :taskId', { taskId })
      .getOne();

    if (!task) throw new NotFoundException('Task with specified id not found');
    return task;
  }

  async addTask(listId: number, taskDescription: string) {
    const list = await this.listService.getList(listId);
    const task = new Task();
    task.goals = [];
    task.description = taskDescription;
    task.list = list;
    await this.taskRepository.save(task);
    return task;
  }

  async updateTask(
    taskId: number,
    description: string,
    isDone: boolean,
  ): Promise<Task> {
    const task = await this.getTask(taskId);
    task.description = description;
    task.markedAsDone = isDone;
    return await this.taskRepository.save(task);
  }

  async removeTask(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id: taskId });
    if (!task) return;
    await this.taskRepository.remove(task);
  }

  async doesTaskBelongToUser(userId: number, taskId: number): Promise<boolean> {
    const task = await this.getTask(taskId);
    return await this.listService.doesListBelongToUser(userId, task.list.id);
  }
}
