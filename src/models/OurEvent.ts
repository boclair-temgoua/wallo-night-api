import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { Organization, User } from './index';
import { StatusType } from '../app/utils/pagination';
import { CurrencyEvent } from '../modules/our-events/our-events.dto';
import { OrderEvent } from './OrderEvent';

@Entity('our_event')
export class OurEvent extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  address: string;

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

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ nullable: true, type: 'timestamptz' })
  expiredAt: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  dateEvent: Date;

  @Column({ default: 'EUR', nullable: true })
  currency: CurrencyEvent;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  messageAfterPayment: string;

  @Column({ default: 'ACTIVE' })
  status?: StatusType;

  @OneToMany(() => OrderEvent, (orderEvents) => orderEvents.ourEvent, {
    onDelete: 'CASCADE',
  })
  orderEvents?: OrderEvent[];

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.ourEvents, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.ourEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;
}
