import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { FilterQueryType } from '../app/utils/search-query';
import { TransactionType } from '../modules/transactions/transactions.type';
import { Contribution, Organization, Subscribe, User } from './index';

@Entity('transaction')
export class Transaction extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @Column({ type: 'float', nullable: true })
  amountConvert: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ default: 'MEMBERSHIP' })
  model?: FilterQueryType;

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
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.transactions)
  @JoinColumn()
  organization?: Relation<Organization>;

  @Column({ type: 'uuid', nullable: true })
  subscribeId?: string;
  @ManyToOne(() => Subscribe, (subscribe) => subscribe.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subscribe?: Relation<Subscribe>;
}
