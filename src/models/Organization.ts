import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../app/databases/common';
import { Payment } from './Payment';
import {
  CartOrder,
  Comment,
  Contributor,
  Membership,
  Post,
  Product,
  Subscribe,
  Transaction,
  Upload,
  User,
  UserAddress,
  Wallet,
} from './index';

@Entity('organization')
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  firstAddress?: string;

  @Column({ nullable: true })
  secondAddress?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ type: 'jsonb', array: false, nullable: true })
  image?: { id: 'aws' | 'provider'; patch: string };

  @OneToOne(() => Wallet, (wallet) => wallet.organization, {
    onDelete: 'CASCADE',
  })
  wallet?: Wallet;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @OneToOne(() => User, (user) => user.organization, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: User;

  @OneToMany(() => User, (user) => user.organization)
  users?: User[];

  @OneToMany(() => Post, (post) => post.organization)
  posts?: Post[];

  @OneToMany(() => Transaction, (transaction) => transaction.organization)
  transactions?: Transaction[];

  @OneToMany(() => Product, (product) => product.organization)
  products?: Product[];

  @OneToMany(() => Subscribe, (subscribe) => subscribe.organization)
  subscribes?: Subscribe[];

  @OneToMany(() => Membership, (membership) => membership.organization)
  memberships?: Membership[];

  @OneToMany(() => Payment, (payment) => payment.organization)
  payments?: Payment[];

  @OneToMany(() => Comment, (comment) => comment.organization)
  comments?: Comment[];

  @OneToMany(() => CartOrder, (cartOrder) => cartOrder.organization)
  cartOrders?: CartOrder[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.organization)
  userAddress?: UserAddress;

  @OneToMany(() => Upload, (upload) => upload.organization, {
    onDelete: 'CASCADE',
  })
  uploads?: Upload;

  @OneToMany(() => Contributor, (contributor) => contributor.organization, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor;
}
