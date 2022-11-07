import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from 'src/common/dto/base.dto';
import { RateEntity } from '../../rate/entities/rate.entity';

@Entity('bank')
export class BankEntity extends Base {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  apiUrl: string;

  @OneToMany(() => RateEntity, (rate) => rate.bank)
  rates?: RateEntity[];
}
