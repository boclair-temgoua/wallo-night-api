import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { User } from './User';
// import { UserAddress } from './UserAddress';
import { OrderProduct } from './OrderProduct';
import { BaseEntity } from '../app/databases/common';

@Entity('client_order')
export class ClientOrder extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false, unique: true })
  orderNumber: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'bigint', nullable: true })
  priceSupTotal: number;

  @Column({ type: 'bigint', nullable: true })
  priceTotalBeforeDiscount: number;

  @Column({ nullable: true })
  vat: string;

  @Column({ type: 'bigint', nullable: true })
  priceTotal: number;

  @Column({ type: 'bigint', nullable: true })
  price: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ type: 'uuid', nullable: true })
  userClientId?: string;

  // @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.clientOrder)
  // orderProducts: OrderProduct[];

  // @ManyToOne(() => User, (user) => user.clientOrderClients)
  // @JoinColumn([{ name: 'userClientId', referencedColumnName: 'id' }])
  // userClient: User;

  // @ManyToOne(() => UserAddress, (userAddress) => userAddress.clientOrders)
  // @JoinColumn()
  // userAddress: UserAddress;
}
