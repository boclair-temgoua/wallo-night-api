import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Relation,
} from 'typeorm';
import { ContributorRole } from '../modules/contributors/contributors.type';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';
import { FilterQueryType } from '../app/utils/search-query/search-query.dto';
import { Campaign } from './Campaign';
import { Gift } from './Gift';
import { Transaction } from './Transaction';
import { Currency } from './Currency';
import { Membership } from './Membership';

@Entity('contribution')
export class Contribution extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @Column({ type: 'float', nullable: true })
  amountConvert: number;

  @Column({ default: 'ORGANIZATION', length: 30 })
  type?: FilterQueryType;

  @Column({ type: 'uuid', nullable: true })
  currencyId?: string;
  @ManyToOne(() => Currency, (currency) => currency.contributions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  currency?: Relation<Currency>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  giftId?: string;
  @ManyToOne(() => Gift, (gift) => gift.contributions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  gift?: Relation<Gift>;

  @Column({ type: 'uuid', nullable: true })
  campaignId?: string;
  @ManyToOne(() => Campaign, (campaign) => campaign.contributions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  campaign?: Relation<Campaign>;

  @Column({ type: 'uuid', nullable: true })
  membershipId?: string;
  @ManyToOne(() => Membership, (membership) => membership.contributions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  membership?: Relation<Membership>;

  @OneToOne(() => Transaction, (transaction) => transaction.contribution, {
    onDelete: 'CASCADE',
  })
  transaction?: Transaction;
}
