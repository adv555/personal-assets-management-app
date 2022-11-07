import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/task-list.entity';

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskList)
    private readonly taskListRepository: Repository<TaskList>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getLists(userId: number): Promise<TaskList[]> {
    return await this.taskListRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async getList(listId: number): Promise<TaskList> {
    const list = await this.taskListRepository.findOneBy({ id: listId });
    if (!list) throw new NotFoundException('List with specified id not found');
    return list;
  }

  async createList(title: string, userId: number): Promise<TaskList> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User with specified id not found');
    const list = new TaskList();
    list.title = title;
    list.user = user;
    list.tasks = [];
    await this.taskListRepository.save(list);
    return list;
  }

  async updateList(newTitle: string, listId: number): Promise<TaskList> {
    const list = await this.getList(listId);
    list.title = newTitle;
    await this.taskListRepository.save(list);
    return list;
  }

  async removeList(listId: number): Promise<void> {
    const list = await this.taskListRepository.findOneBy({ id: listId });
    if (!list) return;
    await this.taskListRepository.remove(list);
  }

  async doesListBelongToUser(userId: number, listId: number): Promise<boolean> {
    const list = await this.getList(listId);
    return list.user.id === userId;
  }
}
