import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { OrderItem, User } from './index';

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
