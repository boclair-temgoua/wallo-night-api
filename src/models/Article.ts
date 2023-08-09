import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { WhoCanSeeType } from '../app/utils/search-query';
import { User } from './User';
import { ArticleType } from '../modules/articles/articles.type';

@Entity('article')
export class Article extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ default: true })
  status?: boolean;

  @Column({ nullable: true })
  title?: string;

  @Column({
    type: 'enum',
    enum: WhoCanSeeType,
    default: WhoCanSeeType.PUBLIC,
  })
  whoCanSee?: WhoCanSeeType;

  @Column({
    type: 'enum',
    enum: ArticleType,
    default: ArticleType.POST,
  })
  type?: ArticleType;

  @Column({ default: true })
  allowDownload?: boolean;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;
}
