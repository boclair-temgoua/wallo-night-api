import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from './Comment';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { User } from './User';
import { Group } from './Group';

@Entity('post')
export class Post extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  groupId?: string;
  @ManyToOne(() => Group, (group) => group.posts, { onDelete: 'CASCADE' })
  @JoinColumn()
  group?: Group;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => Comment, (comment) => comment.postId, {
    onDelete: 'CASCADE',
  })
  comments?: Comment[];
}
