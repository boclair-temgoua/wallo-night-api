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
import { Category } from './Category';
import { FilterQueryType } from '../app/utils/search-query';
import { SubSubProject } from './SubSubProject';
import { SubSubSubProject } from './SubSubSubProject';

@Entity('contact')
export class Contact extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  otherPhone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  countryId?: number;

  @Column({
    type: 'enum',
    enum: FilterQueryType,
    default: FilterQueryType.ORGANIZATION,
  })
  type?: FilterQueryType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  projectId?: string;
  @ManyToOne(() => Project, (project) => project.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project?: Project;

  @Column({ type: 'uuid', nullable: true })
  subProjectId?: string;
  @ManyToOne(() => SubProject, (subProject) => subProject.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subProject?: SubProject;

  @Column({ type: 'uuid', nullable: true })
  subSubProjectId?: string;
  @ManyToOne(() => SubSubProject, (subSubProject) => subSubProject.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subSubProject?: SubSubProject;

  @Column({ type: 'uuid', nullable: true })
  subSubSubProjectId?: string;
  @ManyToOne(
    () => SubSubSubProject,
    (subSubSubProject) => subSubSubProject.contacts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  subSubSubProject?: SubSubSubProject;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string;
  @ManyToOne(() => Category, (category) => category.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category?: Category;
}
