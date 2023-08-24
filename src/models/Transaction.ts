import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { OrderProduct } from './OrderProduct';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';
import { Gift } from './Gift';
import { Contribution } from './Contribution';
import { TransactionType } from '../modules/transactions/transactions.type';
import { Campaign } from './Campaign';
import { Withdrawal } from './Withdrawal';
import { Membership } from './Membership';

@Entity('transaction')
export class Transaction extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'bigint', nullable: true })
  amount: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  //   @Column({ type: 'uuid', nullable: true })
  //   orderProductId?: string;
  //   @ManyToOne(() => OrderProduct, (orderProduct) => orderProduct.transactions, {
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn()
  //   orderProduct?: OrderProduct;

  @Column({ type: 'uuid', nullable: true })
  contributionId?: string;
  @OneToOne(() => Contribution, (contribution) => contribution.transaction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  contribution?: Relation<Contribution>;

  @Column({ default: 'CARD' })
  type?: TransactionType;

  @Column({ type: 'uuid', nullable: true })
  giftId?: string;
  @ManyToOne(() => Gift, (gift) => gift.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  gift?: Relation<Gift>;

  @Column({ type: 'uuid', nullable: true })
  withdrawalId?: string;
  @ManyToOne(() => Withdrawal, (withdrawal) => withdrawal.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  withdrawal?: Relation<Withdrawal>;

  @Column({ type: 'uuid', nullable: true })
  campaignId?: string;
  @ManyToOne(() => Campaign, (campaign) => campaign.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  campaign?: Relation<Campaign>;

  @Column({ type: 'uuid', nullable: true })
  userSendId?: string;
  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userSendId', referencedColumnName: 'id' })
  userSend?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  userReceiveId?: string;
  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userReceiveId', referencedColumnName: 'id' })
  userReceive?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  membershipId?: string;
  @ManyToOne(() => Membership, (membership) => membership.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  membership?: Relation<Membership>;
}
