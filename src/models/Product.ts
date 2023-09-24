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
import { Discount } from './Discount';
import { Cart, User } from './index';
import { ProductStatus } from '../app/utils/pagination';
import { WhoCanSeeType } from '../app/utils/search-query';
import { ProductType } from '../modules/products/products.dto';

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

  @Column({ nullable: true })
  urlRedirect: string;

  @Column({ type: 'boolean', default: false })
  enableUrlRedirect: boolean;

  @Column({ type: 'bigint', default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  messageAfterPayment: string;

  @Column({ nullable: true })
  moreDescription: string;

  @Column({ type: 'boolean', default: false })
  enableChooseQuantity: boolean;

  @Column({ type: 'boolean', default: false })
  enableDiscount: boolean;

  @Column({ type: 'boolean', default: false })
  enableLimitSlot: boolean;

  @Column({ type: 'bigint', default: 0 })
  limitSlot: number;

  @Column({ default: 'ACTIVE' })
  status?:  ProductStatus;

  @Column({ default: 'PHYSICAL' })
  productType?: ProductType;

  @Column({ default: 'PUBLIC' })
  whoCanSee?: WhoCanSeeType;

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

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
