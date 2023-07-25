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
import { Organization } from './Organization';
import { BaseDeleteEntity } from '../app/databases/common';
import { FilterQueryType } from '../app/utils/search-query/search-query.dto';
import { Campaign } from './Campaign';
import { Gift } from './Gift';
import { Transaction } from './Transaction';
import { Currency } from './Currency';

@Entity('contribution')
export class Contribution extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @Column({ type: 'float', nullable: true })
  amountConvert: number;

  @Column({
    type: 'enum',
    enum: FilterQueryType,
    default: FilterQueryType.ORGANIZATION,
  })
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

  @OneToOne(() => Transaction, (transaction) => transaction.contribution, {
    onDelete: 'CASCADE',
  })
  transaction?: Transaction;
}
