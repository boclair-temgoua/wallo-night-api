import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { User } from './User';

@Entity('follow')
export class Follow extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid', nullable: true })
  followerId?: string;
  @ManyToOne(() => User, (user) => user.follows, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'followerId', referencedColumnName: 'id' }])
  follower?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.follows, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;
}
