import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { ProductStatus } from '../app/utils/pagination';
import { Currency } from './Currency';
import { OrderProduct } from './OrderProduct';
import { Cart, Comment, Discount, User } from './index';
@Entity('commission')
export class Commission extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  urlMedia: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  enableLimitSlot: boolean;

  @Column({ type: 'boolean', default: false })
  enableDiscount: boolean;

  @Column({ type: 'bigint', default: 0 })
  limitSlot: number;

  @Column({ type: 'text', nullable: true })
  messageAfterPayment: string;

  @Column({ default: 'ACTIVE' })
  status?: ProductStatus;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ type: 'uuid', nullable: true })
  currencyId: string;
  @ManyToOne(() => Currency, (currency) => currency.commissions)
  @JoinColumn()
  currency: Currency;

  @Column({ type: 'uuid', nullable: true })
  discountId: string;
  @ManyToOne(() => Discount, (discount) => discount.commissions)
  @JoinColumn()
  discount: Discount;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => Comment, (comment) => comment.commission)
  comments?: Comment[];

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
