import { StatusOderProduct } from './../modules/order-products/order-products.dto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
  Relation,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Product } from './Product';
import { User } from './User';
import { Organization } from './Organization';

@Entity('order_product')
export class OrderProduct extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  titleProduct: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'float', nullable: true })
  discountProduct: number;

  @Column({ type: 'float', nullable: true })
  discountCoupon: number;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'float', nullable: true })
  priceDiscount: number;

  @Column({ type: 'float', nullable: true })
  discountPercent: number;

  @Column({ type: 'float', nullable: true })
  priceTotal: number;

  @Column({ type: 'bigint', nullable: true })
  quantity: number;

  @Column('simple-array', { nullable: true })
  returnProduct?: string[];

  @Column({ type: 'bigint', nullable: true })
  userId: number;

  @Column({ type: 'uuid', nullable: true })
  userSellerId?: string;

  @Column({ type: 'uuid', nullable: true })
  userClientId?: string;

  @Column({ type: 'uuid', nullable: true })
  clientOrderId?: string;

  @Column({ type: 'bigint', nullable: true })
  userTransportId: number;

  @Column({ default: 0 })
  statusConversation: number;

  @Column({
    type: 'enum',
    enum: StatusOderProduct,
    default: StatusOderProduct.ORDERED,
  })
  status?: StatusOderProduct;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;
  @ManyToOne(() => Product, (product) => product.orderProducts)
  @JoinColumn()
  product?: Relation<Product>;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;
}
