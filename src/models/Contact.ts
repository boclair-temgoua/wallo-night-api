import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';

@Entity('contact')
export class Contact extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: false })
  isRed?: boolean;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  ipLocation?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  countryId?: number;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
}
