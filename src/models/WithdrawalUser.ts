import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Relation,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';
import { TransactionType } from '../modules/transactions/transactions.type';
import { Withdrawal } from './Withdrawal';

@Entity('withdrawal_user')
export class WithdrawalUser extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  iban: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.CARD,
  })
  type?: TransactionType;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.withdrawalUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.withdrawalUser, {
    onDelete: 'CASCADE',
  })
  withdrawals?: Withdrawal[];
}
