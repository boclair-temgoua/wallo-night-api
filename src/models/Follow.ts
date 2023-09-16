import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { Subscribe } from './Subscribe';

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
