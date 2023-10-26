import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User, Product, Post, Organization } from './index';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { FilterQueryType } from '../app/utils/search-query';

@Entity('comment')
export class Comment extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: 'POST' })
  model?: FilterQueryType;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;
  @ManyToOne(() => Product, (product) => product.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product?: Product;

  @Column({ type: 'uuid', nullable: true })
  postId?: string;
  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post?: Post;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;
}
