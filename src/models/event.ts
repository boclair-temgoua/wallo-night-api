import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { User } from './index';
import { ProductStatus } from '../app/utils/pagination';
import { CurrencyEvent } from '../modules/events/events.dto';

@Entity('event')
export class Event extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  requirement: string;

  @Column({ nullable: true })
  urlMedia: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  urlRedirect: string;

  @Column({ type: 'boolean', default: false })
  enableUrlRedirect: boolean;

  @Column({ type: 'bigint', default: 0 })
  price: number;

  @Column({ default: 'EUR', nullable: true })
  currency: CurrencyEvent;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  messageAfterPayment: string;

  @Column({ default: 'ACTIVE' })
  status?: ProductStatus;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.events, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;
}
