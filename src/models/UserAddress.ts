import { Organization } from './Organization';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Generated,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';

@Entity('user_address')
export class UserAddress extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  street1?: string;

  @Column({ nullable: true })
  street2?: string;

  @Column({ nullable: true })
  cap?: string;

  @Column({ type: 'uuid', nullable: true })
  countryId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @ManyToOne(() => Organization, (organization) => organization.userAddress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;
}
