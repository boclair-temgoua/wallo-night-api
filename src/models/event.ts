import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { Category } from './Category';
import { OrderProduct } from './OrderProduct';
import { Cart, User } from './index';
import { ProductStatus } from '../app/utils/pagination';
import { WhoCanSeeType } from '../app/utils/search-query';
import { ProductType } from '../modules/products/products.dto';

@Entity('event')
export class Event extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  requirement: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  urlRedirect: string;

  @Column({ type: 'boolean', default: false })
  enableUrlRedirect: boolean;

  @Column({ type: 'bigint', default: 0 })
  price: number;

  @Column({ default: 'EUR', nullable: true })
  currency: 'EUR';

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  messageAfterPayment: string;

  @Column({ default: 'ACTIVE' })
  status?: ProductStatus;

  @Column({ default: 'PHYSICAL' })
  productType?: ProductType;

  @Column({ default: 'PUBLIC' })
  whoCanSee?: WhoCanSeeType;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Relation<Category>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
