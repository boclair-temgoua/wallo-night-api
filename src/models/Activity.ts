import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';
import { BaseEntity } from '../app/databases/common/BaseEntity';

@Entity('activity')
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  activityAbleType?: string;

  @Column({ type: 'bigint', nullable: true })
  activityAbleId?: number;

  @Column({ length: 30, nullable: true })
  action?: string;

  @Column({ nullable: true })
  ipLocation?: string;

  @Column({ nullable: true })
  browser?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  platform?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  countryCode?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ type: 'uuid', nullable: true })
  applicationId?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId: string;

  @Column({ type: 'bigint', nullable: true })
  usage?: number;

  @Column({ type: 'bigint', nullable: true })
  view?: number;
}
