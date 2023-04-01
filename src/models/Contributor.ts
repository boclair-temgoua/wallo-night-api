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
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import {
  ContributorRole,
  ContributorType,
} from '../modules/contributors/contributors.type';
import { Project } from './Project';

@Entity('contributor')
export class Contributor extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({
    type: 'enum',
    enum: ContributorType,
    default: ContributorType.ORGANIZATION,
  })
  type?: ContributorType;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.contributors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  projectId?: string;
  @ManyToOne(() => Project, (project) => project.contributors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project?: Organization;

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
