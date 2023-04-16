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
import { SubSubProject } from './SubSubProject';
import { ContactProject } from './ContactProject';

@Entity('sub_sub_sub_project')
export class SubSubSubProject extends BaseDeleteEntity {
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

  @Column({ type: 'uuid', nullable: true })
  subSubProjectId?: string;
  @ManyToOne(
    () => SubSubProject,
    (subSubProject) => subSubProject.subSubSubProjects,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  subSubProject?: SubSubProject;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @OneToMany(() => Contributor, (contributor) => contributor.subSubSubProject, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Document, (document) => document.subSubSubProject, {
    onDelete: 'CASCADE',
  })
  documents?: Document[];

  @OneToMany(
    () => ContactProject,
    (contactProject) => contactProject.subSubSubProject,
    {
      onDelete: 'CASCADE',
    },
  )
  contactProjects?: ContactProject[];
}
