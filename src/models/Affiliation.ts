import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { Product, User } from './index';

@Entity('affiliation')
export class Affiliation extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'float', default: 0 })
  percent: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isOneProduct: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  expiredAt: Date;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;
  @ManyToOne(() => Product, (product) => product.affiliations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product?: Product;

  @Column({ type: 'uuid', nullable: true })
  organizationSellerId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationReceivedId?: string;

  @Column({ type: 'uuid', nullable: true })
  userReceivedId?: string;
  @ManyToOne(() => User, (user) => user.affiliations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userReceivedId', referencedColumnName: 'id' }])
  user?: Relation<User>;
}
