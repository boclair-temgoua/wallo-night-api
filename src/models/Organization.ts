import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';
import { Contributor } from './Contributor';
import { Product } from './Product';
import { Transaction } from './Transaction';
import { Discount } from './Discount';
import { Campaign } from './Campaign';
import { Gift } from './Gift';
import { Withdrawal } from './Withdrawal';
import { WithdrawalUser } from './WithdrawalUser';
import { Membership } from './Membership';

@Entity('organization')
export class Organization extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  firstAddress?: string;

  @Column({ nullable: true })
  secondAddress?: string;

  @Column({ default: false })
  requiresPayment?: boolean;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => User, (user) => user.organizationInUtilization, {
    onDelete: 'CASCADE',
  })
  users?: User[];

  @OneToMany(() => Contributor, (contributor) => contributor.organization, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Product, (product) => product.organization, {
    onDelete: 'CASCADE',
  })
  products?: Product[];

  @OneToMany(() => Transaction, (transaction) => transaction.organization, {
    onDelete: 'CASCADE',
  })
  transactions?: Transaction[];

  @OneToMany(() => Discount, (discount) => discount.organization, {
    onDelete: 'CASCADE',
  })
  discounts: Discount[];

  @OneToMany(() => Campaign, (campaign) => campaign.organization, {
    onDelete: 'CASCADE',
  })
  campaigns?: Campaign[];

  @OneToMany(() => Gift, (gift) => gift.organization, {
    onDelete: 'CASCADE',
  })
  gifts?: Gift[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.organization, {
    onDelete: 'CASCADE',
  })
  withdrawals?: Withdrawal[];

  @OneToMany(
    () => WithdrawalUser,
    (withdrawalUser) => withdrawalUser.organization,
    {
      onDelete: 'CASCADE',
    },
  )
  withdrawalUsers?: WithdrawalUser[];

  @OneToMany(() => Membership, (membership) => membership.organization, {
    onDelete: 'CASCADE',
  })
  memberships?: Membership[];
}
