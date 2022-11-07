import { WalletEntity } from 'src/wallet/entities/wallet.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Task, (task) => task.goals, { onDelete: 'CASCADE' })
  @JoinColumn()
  task: Task;

  @Column({ type: 'int', default: 0 })
  goalBalance: number;

  @ManyToOne((type) => WalletEntity, { onDelete: 'CASCADE', eager: true })
  wallet: WalletEntity;

  isAchieved() {
    return this.wallet.total_balance >= this.goalBalance;
  }

  getDescription() {
    return `To collect ${this.goalBalance} ${this.wallet.currency} in ${
      this.wallet.wallet_name
    } wallet. (${this.isAchieved() ? '' : 'Not '}Achieved)`;
  }
}
