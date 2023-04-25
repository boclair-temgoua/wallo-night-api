import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { User } from './User';
import { Organization } from './Organization';
import { ContactProject } from './ContactProject';
import { SubSubSubProject } from './SubSubSubProject';
import { SubSubProject } from './SubSubProject';
import { SubProject } from './SubProject';
import { Project } from './Project';
import { Contributor } from './Contributor';
import { Post } from './Post';

@Entity('group')
export class Group extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.groups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  projectId?: string;
  @ManyToOne(() => Project, (project) => project.groups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project?: Project;

  @Column({ type: 'uuid', nullable: true })
  subProjectId?: string;
  @ManyToOne(() => SubProject, (subProject) => subProject.groups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subProject?: SubProject;

  @Column({ type: 'uuid', nullable: true })
  subSubProjectId?: string;
  @ManyToOne(() => SubSubProject, (subSubProject) => subSubProject.groups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subSubProject?: SubSubProject;

  @Column({ type: 'uuid', nullable: true })
  subSubSubProjectId?: string;
  @ManyToOne(
    () => SubSubSubProject,
    (subSubSubProject) => subSubSubProject.groups,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  subSubSubProject?: SubSubSubProject;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @OneToMany(() => Contributor, (contributor) => contributor.group, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Post, (post) => post.group, { onDelete: 'CASCADE' })
  posts?: Post[];
}
