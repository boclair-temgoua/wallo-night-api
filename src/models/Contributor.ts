import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Generated,
} from 'typeorm';

import { User } from './User';
import { Organization } from './Organization';
import { BaseEntity } from '../app/databases/common/BaseEntity';
import { ContributorRole } from '../modules/contributors/contributors.type';

@Entity('contributor')
export class Contributor extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  contributeType?: string;

  @Column({ type: 'uuid', nullable: true })
  contributeId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.contributors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userCreatedId', referencedColumnName: 'id' }])
  userCreated?: User;

  @Column({
    type: 'enum',
    enum: ContributorRole,
    default: ContributorRole.ADMIN,
  })
  role?: ContributorRole;
}
