import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common/index';
import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../app/utils/search-query';
import { Commission, Organization, Post, Product, User } from './index';

@Entity('comment')
export class Comment extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: filterQueryTypeArrays, default: 'POST' })
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
  commissionId?: string;
  @ManyToOne(() => Commission, (commission) => commission.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  commission?: Commission;

  @Column({ type: 'uuid', nullable: true })
  userReceiveId?: string;

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
  organization?: Relation<Organization>;
}
