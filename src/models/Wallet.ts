import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../app/databases/common';
import { User } from './User';
import { Organization } from './Organization';

@Entity('wallet')
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  accountId?: string;

  @Column({ type: 'float', default: 0 })
  amount: number;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @OneToOne(() => Organization, (organization) => organization.wallet, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;
}
