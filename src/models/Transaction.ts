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
import { User } from './index';
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
}
