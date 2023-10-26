import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../app/databases/common';
import {
  Wallet,
  Membership,
  Subscribe,
  Product,
  User,
  Transaction,
  Post,
  Comment,
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

  @Column({ nullable: true })
  image?: string;

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

  @OneToMany(() => Comment, (comment) => comment.organization)
  comments?: Comment[];
}
