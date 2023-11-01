import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Relation,
  OneToMany,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { ProductStatus } from '../app/utils/pagination';
import {
  Contribution,
  Subscribe,
  Product,
  User,
  Organization,
  Currency,
  Post,
} from './index';

@Entity('membership')
export class Membership extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: 'ACTIVE' })
  status?: ProductStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'bigint', nullable: true })
  month: number;

  @Column({ type: 'text', nullable: true })
  messageWelcome: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  currencyId?: string;
  @ManyToOne(() => Currency, (currency) => currency.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  currency?: Relation<Currency>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @OneToMany(() => Contribution, (contribution) => contribution.membership, {
    onDelete: 'CASCADE',
  })
  contributions?: Contribution[];

  @OneToMany(() => Subscribe, (subscribe) => subscribe.membership)
  subscribes?: Subscribe[];
}
