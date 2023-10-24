import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Relation,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Transaction } from './Transaction';
import { Currency } from './Currency';
import { BaseDeleteEntity } from '../app/databases/common';
import { Contribution } from './Contribution';
import { ProductStatus } from '../app/utils/pagination';
import { Subscribe } from './Subscribe';
import { Post } from './Post';
import { Product } from './Product';

@Entity('membership')
export class Membership extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: 'ACTIVE' })
  status?: ProductStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'bigint', nullable: true })
  month: number;

  @Column({ type: 'text', nullable: true })
  messageWelcome: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ type: 'uuid', nullable: true })
  currencyId?: string;
  @ManyToOne(() => Currency, (currency) => currency.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  currency?: Relation<Currency>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @OneToMany(() => Contribution, (contribution) => contribution.membership, {
    onDelete: 'CASCADE',
  })
  contributions?: Contribution[];

  @OneToMany(() => Subscribe, (subscribe) => subscribe.membership)
  subscribes?: Subscribe[];

  @OneToMany(() => Post, (post) => post.membership)
  posts?: Post[];

  @OneToMany(() => Product, (product) => product.membership)
  products?: Product[];
}
