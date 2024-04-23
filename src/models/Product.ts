import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { ProductStatus } from '../app/utils/pagination';
import {
    FilterQueryType,
    filterQueryTypeArrays,
} from '../app/utils/search-query';
import {
    ProductType,
    productTypeArrays,
} from '../modules/products/products.dto';
import { Discount } from './Discount';
import {
    Cart,
    Category,
    Comment,
    Country,
    Currency,
    OrderItem,
    Organization,
    Upload,
    User,
} from './index';

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
    timeInit: string;

    @Column({ nullable: true })
    timeEnd: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true, type: 'timestamptz' })
    expiredAt: Date;

    @Column({ nullable: true })
    urlMedia: string;

    @Column({ type: 'enum', enum: filterQueryTypeArrays, default: 'EVENT' })
    model?: FilterQueryType;

    @Column({ nullable: true })
    urlRedirect: string;

    @Column({ type: 'boolean', default: false })
    enableUrlRedirect: boolean;

    @Column({ type: 'float', default: 0 })
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

    @Column({ type: 'boolean', default: true })
    enableVisibility: boolean;

    @Column({ type: 'boolean', default: true })
    enableComment: boolean;

    @Column({ type: 'bigint', default: 0 })
    limitSlot: number;

    @Column({ default: 'ACTIVE' })
    status?: ProductStatus;

    @Column({ type: 'enum', enum: productTypeArrays, default: 'DIGITAL' })
    productType?: ProductType;

    @Column({ type: 'uuid', nullable: true })
    categoryId: string;
    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn()
    category: Relation<Category>;

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

    @Column({ type: 'uuid', nullable: true })
    userId?: string;
    @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
    @JoinColumn()
    user?: User;

    @Column({ type: 'uuid', nullable: true })
    countryId?: string;
    @ManyToOne(() => Country, (country) => country.products, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    country?: Country;

    @Column({ type: 'uuid', nullable: true })
    organizationId?: string;
    @ManyToOne(() => Organization, (organization) => organization.products, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    organization?: Organization;

    @OneToMany(() => Cart, (cart) => cart.product)
    carts: Cart[];

    @OneToMany(() => Comment, (comment) => comment.product)
    comments?: Comment[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

    @OneToMany(() => Upload, (upload) => upload.product, {
        onDelete: 'CASCADE',
    })
    uploads?: Upload;
}
