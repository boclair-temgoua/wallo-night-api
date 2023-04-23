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
import { ContributorRole } from '../modules/contributors/contributors.type';
import { Project } from './Project';
import { SubProject } from './SubProject';
import { FilterQueryType } from '../app/utils/search-query/search-query.dto';
import { SubSubProject } from './SubSubProject';
import { SubSubSubProject } from './SubSubSubProject';
import { Group } from './Group';

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
    enum: FilterQueryType,
    default: FilterQueryType.ORGANIZATION,
  })
  type?: FilterQueryType;

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
  project?: Project;

  @Column({ type: 'uuid', nullable: true })
  subProjectId?: string;
  @ManyToOne(() => SubProject, (subProject) => subProject.contributors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subProject?: SubProject;

  @Column({ type: 'uuid', nullable: true })
  subSubProjectId?: string;
  @ManyToOne(
    () => SubSubProject,
    (subSubProject) => subSubProject.contributors,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  subSubProject?: SubSubProject;

  @Column({ type: 'uuid', nullable: true })
  subSubSubProjectId?: string;
  @ManyToOne(
    () => SubSubSubProject,
    (subSubSubProject) => subSubSubProject.contributors,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  subSubSubProject?: SubSubSubProject;

  @Column({ type: 'uuid', nullable: true })
  groupId?: string;
  @ManyToOne(() => Group, (group) => group.contributors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  group?: Group;

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
