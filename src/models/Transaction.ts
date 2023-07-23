import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { OrderProduct } from './OrderProduct';
import { User } from './User';
import { BaseEntity } from '../app/databases/common';
import { Organization } from './Organization';
import { Donation } from './Donation';
import { Discount } from './Discount';
import { Gift } from './Gift';

@Entity('transaction')
export class Transaction extends BaseEntity {
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
  giftId?: string;
  @ManyToOne(() => Gift, (gift) => gift.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  gift?: Relation<Gift>;

  @Column({ type: 'uuid', nullable: true })
  userISendId?: string;
  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userISendId', referencedColumnName: 'id' })
  userISend?: Relation<User>;

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
