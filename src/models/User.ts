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
import { NextStep } from '../modules/users/users.type';
import { Follow } from './Follow';
import { Like } from './Like';
import { Membership } from './Membership';
import { Payment } from './Payment';
import { Subscribe } from './Subscribe';
import {
  AuthProvider,
  Campaign,
  Cart,
  Comment,
  Contributor,
  Discount,
  Donation,
  Order,
  OrderItem,
  Organization,
  Post,
  Product,
  Profile,
  Transaction,
} from './index';

@Entity('user')
export class User extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  confirmedAt?: Date;

  @Column({ nullable: true })
  email?: string;

  @Column('simple-array', { nullable: true })
  accessToken?: string[];

  @Column('simple-array', { nullable: true })
  refreshToken?: string[];

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ default: 'USER', nullable: true })
  permission?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  provider?: string;

  @Column({ default: 'SETTING_PROFILE' })
  nextStep?: NextStep;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  profileId?: string;
  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile?: Profile;

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns?: Campaign[];

  @OneToMany(() => Subscribe, (subscribe) => subscribe.user)
  subscribes?: Subscribe[];

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @OneToMany(() => Discount, (discount) => discount.user)
  discounts?: Discount[];

  @OneToOne(() => Donation, (donation) => donation.user, {
    onDelete: 'CASCADE',
  })
  donation?: Donation;

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

  @OneToMany(() => AuthProvider, (authProvider) => authProvider.user, {
    onDelete: 'CASCADE',
  })
  authProviders?: AuthProvider[];

  @OneToMany(() => Payment, (payment) => payment.user, {
    onDelete: 'CASCADE',
  })
  payments?: Payment[];

  @OneToMany(() => Membership, (membership) => membership.user, {
    onDelete: 'CASCADE',
  })
  memberships?: Membership[];
}
