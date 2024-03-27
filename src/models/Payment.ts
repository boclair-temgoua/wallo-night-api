import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import {
  ActionPayment,
  StatusPayment,
  actionPaymentArray,
  statusPaymentArray,
} from '../modules/payments/payments.dto';
import {
  TransactionType,
  transactionTypeArrays,
} from '../modules/transactions/transactions.type';
import { User } from './User';
import { Organization } from './index';

@Entity('payment')
export class Payment extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  brand?: string;

  @Column({ type: 'enum', enum: statusPaymentArray, default: 'PENDING' })
  status?: StatusPayment;

  @Column({ type: 'enum', enum: actionPaymentArray, default: 'PAYMENT' })
  action?: ActionPayment;

  @Column({ nullable: true })
  iban?: string;

  @Column({ nullable: true })
  cardNumber?: string;

  @Column({ nullable: true })
  cardExpMonth?: number;

  @Column({ nullable: true })
  cardExpYear?: number;

  @Column({ nullable: true })
  cardCvc?: string;

  @Column({ type: 'enum', enum: transactionTypeArrays, default: 'CARD' })
  type?: TransactionType;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;
}
