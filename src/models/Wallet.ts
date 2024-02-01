import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../app/databases/common';
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
