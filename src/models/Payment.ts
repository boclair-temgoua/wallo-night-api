import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { User } from './User';
import { TransactionType } from '../modules/transactions/transactions.type';
import { Organization } from './index';
import {
  StatusPayment,
  StatusPaymentArray,
} from '../modules/payments/payments.dto';

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

  @Column({ type: 'enum', enum: StatusPaymentArray, default: 'PENDING' })
  status?: StatusPayment;

  @Column({ nullable: true })
  cardNumber?: string;

  @Column({ nullable: true })
  cardExpMonth?: number;

  @Column({ nullable: true })
  cardExpYear?: number;

  @Column({ nullable: true })
  cardCvc?: string;

  @Column({ default: 'CARD' })
  type?: TransactionType;

  @Column({ type: 'text', nullable: true })
  description?: string;

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
