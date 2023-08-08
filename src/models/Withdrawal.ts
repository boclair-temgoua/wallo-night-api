import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';
import { Transaction } from './Transaction';
import { WithdrawalUser } from './WithdrawalUser';

@Entity('withdrawal')
export class Withdrawal extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @Column({ nullable: true, type: 'timestamptz' })
  confirmedAt: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.withdrawals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  withdrawalUserId?: string;
  @ManyToOne(
    () => WithdrawalUser,
    (withdrawalUser) => withdrawalUser.withdrawals,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  withdrawalUser?: Relation<WithdrawalUser>;

  @OneToMany(() => Transaction, (transaction) => transaction.withdrawal, {
    onDelete: 'CASCADE',
  })
  transactions?: Transaction[];
}
