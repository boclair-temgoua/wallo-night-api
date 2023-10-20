import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { StatusType } from '../app/utils/pagination';
import { BaseDeleteEntity } from '../app/databases/common';
import { User } from './User';
import { OurEvent } from './OurEvent';
import { Transaction } from './Transaction';

@Entity('order_event')
export class OrderEvent extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ default: 'ACTIVE' })
  status?: StatusType;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  currency?: string;

  @Column({ type: 'float', nullable: true })
  priceEvent?: number;

  @Column({ nullable: true })
  imageEvent?: string;

  @Column({ nullable: true })
  userConfirmedId?: string;

  @Column({ nullable: true })
  organizationId?: string;

  @Column({ nullable: true })
  ourEventId?: string;
  @ManyToOne(() => OurEvent, (ourEvent) => ourEvent.orderEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  ourEvent?: OurEvent;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.orderEvents, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  transactionId?: string;
  @ManyToOne(() => Transaction, (transaction) => transaction.orderEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  transaction?: Transaction;
}
