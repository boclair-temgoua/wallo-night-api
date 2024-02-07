import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { StatusCart } from './../modules/cats/cats.dto';

import { BaseDeleteEntity } from '../app/databases/common';
import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../app/utils/search-query';
import { Commission, Product, User } from './index';

@Entity('cart')
export class Cart extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: 'ADDED' })
  status?: StatusCart;

  @Column({ type: 'bigint', nullable: true })
  quantity: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'uuid', nullable: true })
  cartOrderId?: string;

  @Column({ type: 'enum', enum: filterQueryTypeArrays, default: 'COMMISSION' })
  model?: FilterQueryType;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;
  @ManyToOne(() => Product, (product) => product.carts)
  @JoinColumn()
  product?: Relation<Product>;

  @Column({ type: 'uuid', nullable: true })
  commissionId?: string;
  @ManyToOne(() => Commission, (commission) => commission.carts)
  @JoinColumn()
  commission?: Relation<Commission>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ nullable: true })
  ipLocation?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
}
