import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Base } from 'src/common/dto/base.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { Task } from './task.entity';

@Entity('task_list')
export class TaskList extends Base {
  @Column({
    type: 'varchar',
    length: '40',
    default: 'No Title',
  })
  title: string;

  @ManyToOne((type) => UserEntity, { eager: true })
  user: UserEntity;

  @OneToMany((type) => Task, (task) => task.list, { eager: true })
  tasks: Task[];
}
