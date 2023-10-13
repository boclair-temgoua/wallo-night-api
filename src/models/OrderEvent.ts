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

@Entity('order_event')
export class OrderEvent extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ default: 'ACTIVE' })
  status?: StatusType;

  @Column({ nullable: true })
  transactionId?: string;

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
}
