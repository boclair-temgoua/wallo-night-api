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
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Category } from './Category';
import { Organization } from './Organization';

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

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  moreDescription: string;

  @Column({ type: 'bigint', unique: true, nullable: true })
  inventoryProductId: number;

  // @Column({ default: 'ACTIVE', length: 30 })
  // status: schemaStatusProduct;

  @Column({ type: 'bigint', nullable: true })
  imageUploadId: number;

  @Column({ type: 'bigint', nullable: true })
  discountId: number;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Relation<Category>;

  // @OneToOne(() => InventoryProduct, (inventoryProduct) => inventoryProduct.product, { onDelete: 'CASCADE' })
  // @JoinColumn()
  // inventoryProduct: InventoryProduct;

  // @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  // @JoinColumn()
  // user: User;

  // @ManyToOne(() => ImageUpload, (imageUpload) => imageUpload.product)
  // @JoinColumn()
  // imageUpload: ImageUpload;

  // @ManyToOne(() => Discount, (discount) => discount.products)
  // @JoinColumn()
  // discount: Discount;

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

  // @OneToMany(() => Favorite, (favorite) => favorite.product)
  // favorites: Favorite[];

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;
}
