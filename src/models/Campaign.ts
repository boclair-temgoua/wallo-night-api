import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { Contribution } from './Contribution';
import { Transaction } from './Transaction';
import { User } from './User';

@Entity('campaign')
export class Campaign extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  startedAt: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  expiredAt: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.campaigns, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @OneToMany(() => Transaction, (transaction) => transaction.campaign, {
    onDelete: 'CASCADE',
  })
  transactions?: Transaction[];

  @OneToMany(() => Contribution, (contribution) => contribution.campaign, {
    onDelete: 'CASCADE',
  })
  contributions?: Contribution[];
}
