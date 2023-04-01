import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Contributor } from './Contributor';
import { Organization } from './Organization';
import { Project } from './Project';

@Entity('sub_project')
export class SubProject extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @Column({ type: 'uuid', nullable: true })
  projectId?: string;
  @ManyToOne(() => Project, (project) => project.subProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project?: Project;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.subProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: User;

  @OneToMany(() => Contributor, (contributor) => contributor.project, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];
}
