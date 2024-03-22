import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { FilterQueryType } from '../app/utils/search-query';
import { User } from './User';

@Entity('like')
export class Like extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: 'COMMENT' })
  type?: FilterQueryType;

  @Column({ type: 'uuid', nullable: true })
  likeableId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;
}
