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
} from '../app/utils/search-query/search-query.dto';
import { UploadType } from '../modules/uploads/uploads.type';
import { Commission, Membership, Organization, Post, Product } from './index';

@Entity('upload')
export class Upload extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  size?: number;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ default: 'IMAGE' })
  uploadType?: UploadType;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'enum', enum: filterQueryTypeArrays, default: 'PRODUCT' })
  model?: FilterQueryType;

  @Column({ type: 'uuid', nullable: true })
  uploadableId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.uploads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;

  @Column({ type: 'uuid', nullable: true })
  postId?: string;
  @ManyToOne(() => Post, (post) => post.uploads, { onDelete: 'CASCADE' })
  @JoinColumn()
  post?: Relation<Post>;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;
  @ManyToOne(() => Product, (product) => product.uploads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product?: Relation<Product>;

  @Column({ type: 'uuid', nullable: true })
  commissionId?: string;
  @ManyToOne(() => Commission, (commission) => commission.uploads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  commission?: Relation<Commission>;

  @Column({ type: 'uuid', nullable: true })
  membershipId?: string;
  @ManyToOne(() => Membership, (membership) => membership.uploads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  membership?: Relation<Membership>;
}
