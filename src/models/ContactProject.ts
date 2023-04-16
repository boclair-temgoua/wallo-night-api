import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Organization } from './Organization';
import { Project } from './Project';
import { SubProject } from './SubProject';
import { FilterQueryType } from '../app/utils/search-query';
import { SubSubProject } from './SubSubProject';
import { SubSubSubProject } from './SubSubSubProject';
import { Contact } from './Contact';

@Entity('contact_project')
export class ContactProject extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'enum',
    enum: FilterQueryType,
    default: FilterQueryType.ORGANIZATION,
  })
  type?: FilterQueryType;

  @Column({ type: 'uuid', nullable: true })
  contactId?: string;
  @ManyToOne(() => Contact, (contact) => contact.contactProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  contact?: Contact;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(
    () => Organization,
    (organization) => organization.contactProjects,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  projectId?: string;
  @ManyToOne(() => Project, (project) => project.contactProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project?: Project;

  @Column({ type: 'uuid', nullable: true })
  subProjectId?: string;
  @ManyToOne(() => SubProject, (subProject) => subProject.contactProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subProject?: SubProject;

  @Column({ type: 'uuid', nullable: true })
  subSubProjectId?: string;
  @ManyToOne(
    () => SubSubProject,
    (subSubProject) => subSubProject.contactProjects,
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
    (subSubSubProject) => subSubSubProject.contactProjects,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  subSubSubProject?: SubSubSubProject;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;
}
