import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/task-list.entity';
import { TaskListService } from './task-list.service';
import { TaskService } from './task.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { ToDoController } from './todo.controller';
import { AuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { Goal } from './entities/goal.entity';
import { GoalService } from './goal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskList, UserEntity, Goal])],
  providers: [TaskListService, TaskService, GoalService],
  controllers: [ToDoController],
})
export class ToDoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ToDoController);
  }
}
