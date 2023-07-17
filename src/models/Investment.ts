import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { User } from './User';
import { Donation } from './Donation';
import { Organization } from './Organization';
import { Currency } from './Currency';

@Entity('investment')
export class Investment extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ nullable: true, type: 'timestamptz' })
  expiredAt: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  token?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @Column({ type: 'uuid', nullable: true })
  currencyId?: string;
  @ManyToOne(() => Currency, (currency) => currency.investments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  currency?: Relation<Currency>;

  @Column({ type: 'uuid', nullable: true })
  donationId?: string;
  @ManyToOne(() => Donation, (donation) => donation.investments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  donation?: Donation;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.investments, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.investments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;
}
