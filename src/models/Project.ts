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
import { Document } from './Document';
import { SubProject } from './SubProject';

@Entity('project')
export class Project extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: User;

  @OneToMany(() => Contributor, (contributor) => contributor.project, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => SubProject, (subProject) => subProject.project, {
    onDelete: 'CASCADE',
  })
  subProjects?: SubProject[];

  @OneToMany(() => Document, (document) => document.project, {
    onDelete: 'CASCADE',
  })
  documents?: Document[];
}
