import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import {
    Cart,
    Comment,
    Contributor,
    Follow,
    Like,
    Order,
    OrderItem,
    Organization,
    Payment,
    Post,
    Product,
    Profile,
    Provider,
    Transaction,
    UserAddress,
} from './index';

@Entity('user')
export class User extends BaseDeleteEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true })
    confirmedAt?: Date;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    emailConfirmedAt?: Date;

    @Column({ nullable: true })
    phoneConfirmedAt?: Date;

    @Column({ nullable: true })
    username?: string;

    @Column({ nullable: true })
    token?: string;

    @Column({ default: 'USER', nullable: true })
    permission?: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ type: 'uuid', nullable: true })
    organizationId?: string;
    @ManyToOne(() => Organization, (organization) => organization.users, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    organization?: Relation<Organization>;

    @Column({ type: 'uuid', nullable: true })
    profileId?: string;
    @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
    @JoinColumn()
    profile?: Profile;

    @OneToMany(() => Post, (post) => post.user)
    posts?: Post[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments?: Comment[];

    @OneToMany(() => Product, (product) => product.user)
    products?: Product[];

    @OneToMany(() => Order, (order) => order.user)
    orders?: Order[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.user)
    orderItems?: OrderItem[];

    @OneToMany(() => Transaction, (transaction) => transaction.userSend, {
        onDelete: 'CASCADE',
    })
    transactions?: Transaction[];

    @OneToMany(() => Contributor, (contributor) => contributor.user, {
        onDelete: 'CASCADE',
    })
    contributors?: Contributor[];

    @OneToMany(() => Like, (like) => like.user, {
        onDelete: 'CASCADE',
    })
    likes?: Like[];

    @OneToMany(() => Follow, (follow) => follow.user, {
        onDelete: 'CASCADE',
    })
    follows?: Follow[];

    @OneToMany(() => Cart, (cart) => cart.user, {
        onDelete: 'CASCADE',
    })
    carts?: Cart[];

    @OneToOne(() => UserAddress, (userAddress) => userAddress.user)
    userAddress?: UserAddress;

    @Column({
        type: 'enum',
        enum: ['PROVIDER', 'DEFAULT'],
        default: 'DEFAULT',
    })
    provider?: 'PROVIDER' | 'DEFAULT';
    @OneToMany(() => Provider, (provider) => provider.user, {
        onDelete: 'CASCADE',
    })
    providers?: Provider[];

    @OneToMany(() => Payment, (payment) => payment.user, {
        onDelete: 'CASCADE',
    })
    payments?: Payment[];
}
