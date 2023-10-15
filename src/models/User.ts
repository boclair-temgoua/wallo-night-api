import * as bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Generated,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { Withdrawal } from './Withdrawal';
import { Membership } from './Membership';
import { WithdrawalUser } from './WithdrawalUser';
import { NextStep } from '../modules/users/users.type';
import {
  Post,
  Comment,
  Campaign,
  Gift,
  Wallet,
  Transaction,
  Cart,
  Contributor,
  Profile,
  Product,
  Discount,
  Organization,
} from './index';
import { Follow } from './Follow';
import { Like } from './Like';
import { Subscribe } from './Subscribe';

@Entity('user')
export class User extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  confirmedAt?: Date;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column('simple-array', { nullable: true })
  accessToken?: string[];

  @Column('simple-array', { nullable: true })
  refreshToken?: string[];

  @Column({ unique: true, nullable: true })
  username?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ default: 'USER', nullable: true })
  permission?: string;

  @Column({ nullable: true })
  password?: string;

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

  @OneToMany(() => Product, (product) => product.user)
  products?: Product[];

  @OneToMany(() => Transaction, (transaction) => transaction.userSend, {
    onDelete: 'CASCADE',
  })
  transactions?: Transaction[];

  @OneToMany(() => Contributor, (contributor) => contributor.user, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Gift, (gift) => gift.user, {
    onDelete: 'CASCADE',
  })
  gifts?: Gift[];

  @OneToMany(() => Like, (like) => like.user, {
    onDelete: 'CASCADE',
  })
  likes?: Like[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.user, {
    onDelete: 'CASCADE',
  })
  withdrawals?: Withdrawal[];

  @OneToMany(() => Follow, (follow) => follow.user, {
    onDelete: 'CASCADE',
  })
  follows?: Follow[];

  @OneToMany(() => WithdrawalUser, (withdrawalUser) => withdrawalUser.user, {
    onDelete: 'CASCADE',
  })
  withdrawalUsers?: WithdrawalUser[];

  @OneToMany(() => Cart, (cart) => cart.user, {
    onDelete: 'CASCADE',
  })
  carts?: Cart[];

  @OneToMany(() => Membership, (membership) => membership.user, {
    onDelete: 'CASCADE',
  })
  memberships?: Membership[];

  async hashPassword(password: string) {
    this.password = await bcrypt.hashSync(
      String(password) || String(this.password),
      8,
    );
  }

  checkIfPasswordMatch(password: string) {
    return bcrypt.compareSync(String(password), String(this.password));
  }
}
