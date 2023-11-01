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
import { WhoCanSeeType, whoCanSeeTypeArrays } from '../app/utils/search-query';
import { User } from './User';
import { PostType } from '../modules/posts/posts.type';
import { Comment, PostCategory, Membership, Organization } from './index';
import { ProductStatus } from '../app/utils/pagination';

@Entity('post')
export class Post extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'boolean', default: false })
  enableUrlMedia: boolean;

  @Column({ nullable: true })
  urlMedia?: string;

  @Column({ type: 'enum', enum: whoCanSeeTypeArrays, default: 'PUBLIC' })
  whoCanSee?: WhoCanSeeType;

  @Column({ default: 'ARTICLE' })
  type?: PostType;

  @Column({ default: 'ACTIVE' })
  status?: ProductStatus;

  @Column({ default: false })
  allowDownload?: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @OneToMany(() => PostCategory, (postCategory) => postCategory.post)
  postCategories?: PostCategory[];
}
