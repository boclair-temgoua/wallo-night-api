import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { OrderItem, Transaction, User } from './index';

@Entity('order')
export class Order extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  orderNumber: string;

  @Column({ type: 'float', nullable: true })
  totalPriceDiscount: number;

  @Column({ type: 'float', nullable: true })
  totalPriceNoDiscount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToOne(() => Transaction, (transaction) => transaction.order, {
    onDelete: 'CASCADE',
  })
  transaction?: Transaction;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
