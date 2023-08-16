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
} from './index';
import { Follow } from './Follow';
import { Like } from './Like';

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

  @Column({ nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: NextStep,
    default: NextStep.SETTING_PROFILE,
  })
  nextStep?: NextStep;

  @Column({ type: 'uuid', nullable: true })
  profileId?: string;
  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile?: Profile;

  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    onDelete: 'CASCADE',
  })
  wallet?: Wallet;

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns?: Campaign[];

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
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
