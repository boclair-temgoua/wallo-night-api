import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { FilterQueryType } from '../app/utils/search-query/search-query.dto';

@Entity('like')
export class Like extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'enum',
    enum: FilterQueryType,
    default: FilterQueryType.COMMENT,
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