import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { FilterQueryType } from '../app/utils/search-query';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { User } from './User';

@Entity('like')
export class Like extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'enum',
    enum: FilterQueryType,
    default: FilterQueryType.ORGANIZATION,
  })
  type?: FilterQueryType;

  @Column({ type: 'uuid', nullable: true })
  likeableId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;
}
