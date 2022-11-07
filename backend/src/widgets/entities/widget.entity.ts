import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/dto/base.dto';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';

@Entity('widget')
@Index(['userId'], { unique: false })
export class WidgetEntity extends Base {
  @ManyToOne(() => UserEntity, (user) => user.widgets)
  user: UserEntity;

  @ApiProperty({ description: 'id of the user to whom the widget belongs' })
  @Column({ nullable: false })
  userId: number;

  @ApiProperty({ description: 'widget name' })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ description: 'component key identificator' })
  @Column({ type: 'varchar' })
  key: string;

  @ApiProperty({ description: 'contains state of widget react component' })
  @Column({ type: 'json', default: {} })
  state: Record<string, any>;
}
