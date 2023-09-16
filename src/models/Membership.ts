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
import { Transaction } from './Transaction';
import { Currency } from './Currency';
import { BaseDeleteEntity } from '../app/databases/common';
import { Contribution } from './Contribution';
import { StatusType } from '../app/utils/pagination';
import { Subscribe } from './Subscribe';

@Entity('membership')
export class Membership extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: 'ACTIVE' })
  status?: StatusType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', nullable: true })
  pricePerMonthly: number;

  @Column({ type: 'text', nullable: true })
  messageWelcome: string;

  @Column({ type: 'float', nullable: true })
  pricePerYearly: number;

  @Column({ type: 'uuid', nullable: true })
  currencyId?: string;
  @ManyToOne(() => Currency, (currency) => currency.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  currency?: Relation<Currency>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @OneToMany(() => Contribution, (contribution) => contribution.membership, {
    onDelete: 'CASCADE',
  })
  contributions?: Contribution[];

  @OneToMany(() => Subscribe, (subscribe) => subscribe.membership)
  subscribes?: Subscribe[];
}
