import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Contributor } from './Contributor';
import { Document } from './Document';
import { Contact } from './Contact';
import { SubProject } from './SubProject';
import { SubSubSubProject } from './SubSubSubProject';
import { ContactProject } from './ContactProject';

@Entity('sub_sub_project')
export class SubSubProject extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ type: 'uuid', nullable: true })
  projectId?: string;

  @Column({ type: 'uuid', nullable: true })
  subProjectId?: string;
  @ManyToOne(() => SubProject, (subProject) => subProject.subSubProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subProject?: SubProject;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @OneToMany(() => Contributor, (contributor) => contributor.subSubProject, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Document, (document) => document.subSubProject, {
    onDelete: 'CASCADE',
  })
  documents?: Document[];

  @OneToMany(
    () => SubSubSubProject,
    (subSubSubProject) => subSubSubProject.subSubProject,
    {
      onDelete: 'CASCADE',
    },
  )
  subSubSubProjects?: SubSubSubProject[];

  @OneToMany(
    () => ContactProject,
    (contactProject) => contactProject.subSubProject,
    {
      onDelete: 'CASCADE',
    },
  )
  contactProjects?: ContactProject[];
}
