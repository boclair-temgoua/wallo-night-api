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
import { Organization } from './Organization';
import { Contributor } from './Contributor';
import { Investment } from './Investment';

@Entity('donation')
export class Donation extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  expiredAt: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ type: 'uuid', nullable: true })
  currencyId?: string;
  @ManyToOne(() => Currency, (currency) => currency.donations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  currency?: Relation<Currency>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.donations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.donations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;

  @OneToMany(() => Transaction, (transaction) => transaction.donation, {
    onDelete: 'CASCADE',
  })
  transactions?: Transaction[];

  @OneToMany(() => Contributor, (contributor) => contributor.donation, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Investment, (investment) => investment.donation, {
    onDelete: 'CASCADE',
  })
  investments?: Investment[];
}
