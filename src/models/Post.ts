import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { WhoCanSeeType } from '../app/utils/search-query';
import { User } from './User';
import { PostType } from '../modules/posts/posts.type';
import { Comment } from './Comment';
import { Category } from './Category';
import { PostCategory } from './PostCategory';

@Entity('post')
export class Post extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ default: true })
  status?: boolean;

  @Column({ nullable: true })
  title?: string;

  @Column({ default: 'PUBLIC' })
  whoCanSee?: WhoCanSeeType;

  @Column({ default: 'ARTICLE' })
  type?: PostType;

  @Column({ default: false })
  allowDownload?: boolean;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @OneToMany(() => PostCategory, (postCategory) => postCategory.post)
  postCategories?: PostCategory[];
}
