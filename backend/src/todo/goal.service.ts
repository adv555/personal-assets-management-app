import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from 'src/wallet/entities/wallet.entity';
import { EntityManager, Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { Task } from './entities/task.entity';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getGoalsForTask(taskId) {
    return await this.goalRepository
      .createQueryBuilder('goal')
      .leftJoinAndSelect('goal.task', 'task')
      .leftJoinAndSelect('goal.wallet', 'wallet')
      .where('task.id = :tId', { tId: taskId })
      .getMany();
  }

  async everyGoalAchieved(taskId) {
    return (await this.getGoalsForTask(taskId)).every((g) => g.isAchieved());
  }

  async addGoalToTask(taskId: number, walletId: number, goalBalance: number) {
    const taskRepo = this.entityManager.getRepository(Task);
    const task = await taskRepo.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException('Task not found');
    const wallet = await this.entityManager
      .getRepository(WalletEntity)
      .findOneBy({ id: walletId });
    if (!wallet) throw new NotFoundException('Specified wallet not found');
    if (goalBalance < 0) goalBalance = 0;
    const goal = new Goal();
    goal.wallet = wallet;
    goal.goalBalance = goalBalance * 100;
    goal.task = task;
    await this.goalRepository.insert(goal);
    return goal;
  }

  async removeGoal(id: number) {
    const goal = await this.goalRepository.findOneBy({ id: id });
    if (goal) await this.goalRepository.remove(goal);
    return id;
  }

  async clearTask(taskId: number) {
    const task = await this.entityManager
      .getRepository(Task)
      .findOneBy({ id: taskId });
    if (task && task.goals?.length > 0) {
      await this.goalRepository.remove(task.goals);
    }
    return taskId;
  }
}
