import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { OrderProduct } from './OrderProduct';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';
import { Organization } from './Organization';
import { Donation } from './Donation';
import { Gift } from './Gift';
import { Contribution } from './Contribution';
import { TransactionType } from '../modules/transactions/transactions.type';

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

  //   @Column({ type: 'uuid', nullable: true })
  //   orderProductId?: string;
  //   @ManyToOne(() => OrderProduct, (orderProduct) => orderProduct.transactions, {
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn()
  //   orderProduct?: OrderProduct;

  @Column({ type: 'uuid', nullable: true })
  donationId?: string;
  @ManyToOne(() => Donation, (donation) => donation.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  donation?: Relation<Donation>;

  @Column({ type: 'uuid', nullable: true })
  contributionId?: string;
  @OneToOne(() => Contribution, (contribution) => contribution.transaction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  contribution?: Relation<Contribution>;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.CARD,
  })
  type?: TransactionType;

  @Column({ type: 'uuid', nullable: true })
  giftId?: string;
  @ManyToOne(() => Gift, (gift) => gift.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  gift?: Relation<Gift>;

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
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;
}
