import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { TransactionType } from '../modules/transactions/transactions.type';
import {
  Withdrawal,
  Subscribe,
  Membership,
  Contribution,
  Gift,
  User,
  Campaign,
} from './index';
import { FilterQueryType } from '../app/utils/search-query';

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

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ default: 'MEMBERSHIP' })
  model?: FilterQueryType;

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
  subscribeId?: string;
  @ManyToOne(() => Subscribe, (subscribe) => subscribe.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subscribe?: Relation<Subscribe>;
}
