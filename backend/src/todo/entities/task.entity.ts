import { Entity, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Base } from 'src/common/dto/base.dto';
import { TaskList } from './task-list.entity';
import { Goal } from './goal.entity';

@Entity('task')
export class Task extends Base {
  @Column({
    type: 'varchar',
    length: 150,
    default: 'My task to do',
  })
  description: string;

  @Column({
    name: 'marked_as_done',
    type: 'boolean',
    default: false,
  })
  markedAsDone: boolean;

  @ManyToOne((type) => TaskList, (list) => list.tasks, { onDelete: 'CASCADE' })
  list: TaskList;

  @OneToMany((type) => Goal, (goal) => goal.task, { eager: true })
  goals: Goal[];

  isDone() {
    return (
      this.markedAsDone ||
      (this.goals.length > 0 && this.goals.every((g) => g.isAchieved()))
    );
  }
}
