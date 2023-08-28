import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToOne,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';

import { Currency } from './Currency';
import { BaseDeleteEntity } from '../app/databases/common';
import { Category } from './Category';
import { OrderProduct } from './OrderProduct';
import { StatusProduct } from '../modules/products/products.dto';
import { Discount } from './Discount';
import { User } from '.';

@Entity('product')
export class Product extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  subTitle: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  urlMedia: string;

  @Column({ type: 'bigint', default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  messageAfterPurchase: string;

  @Column({ nullable: true })
  moreDescription: string;

  @Column({ type: 'boolean', default: false })
  isChooseQuantity: boolean;

  @Column({ type: 'boolean', default: false })
  isDiscount: boolean;

  @Column({ type: 'boolean', default: false })
  isLimitSlot: boolean;

  @Column({ type: 'bigint', default: 0 })
  limitSlot: number;

  @Column({ default: 'ACTIVE' })
  status?: StatusProduct;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Relation<Category>;

  // @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  // @JoinColumn()
  // user: User;

  // @ManyToOne(() => ImageUpload, (imageUpload) => imageUpload.product)
  // @JoinColumn()
  // imageUpload: ImageUpload;

  @Column({ type: 'uuid', nullable: true })
  discountId: string;
  @ManyToOne(() => Discount, (discount) => discount.products)
  @JoinColumn()
  discount: Discount;

  @Column({ type: 'uuid', nullable: true })
  currencyId: string;
  @ManyToOne(() => Currency, (currency) => currency.products)
  @JoinColumn()
  currency: Currency;

  // @OneToMany(() => ImageUpload, (imageUpload) => imageUpload.product, { onDelete: 'CASCADE' })
  // imageUploads: ImageUpload[];

  // @OneToMany(() => Comment, (comment) => comment.product, { onDelete: 'CASCADE' })
  // comments: Comment[];

  // @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product, { onDelete: 'CASCADE' })
  // orderProducts: OrderProduct[];

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
