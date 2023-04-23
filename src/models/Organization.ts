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
import { UserAddress } from './UserAddress';
import { Project } from './Project';
import { Document } from './Document';
import { SubProject } from './SubProject';
import { Contact } from './Contact';
import { Category } from './Category';
import { ContactProject } from './ContactProject';
import { Group } from './Group';

@Entity('organization')
export class Organization extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: false })
  requiresPayment?: boolean;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @OneToMany(() => Contributor, (contributor) => contributor.organization, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Project, (project) => project.organization, {
    onDelete: 'CASCADE',
  })
  projects?: Project[];

  @OneToMany(() => SubProject, (subProject) => subProject.organization, {
    onDelete: 'CASCADE',
  })
  subProjects?: SubProject[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.organization)
  userAddress?: UserAddress[];

  @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => User, (user) => user.organizationInUtilization, {
    onDelete: 'CASCADE',
  })
  users?: User[];

  @OneToMany(() => Document, (document) => document.organization, {
    onDelete: 'CASCADE',
  })
  documents?: Document[];

  @OneToMany(() => Group, (group) => group.organization, {
    onDelete: 'CASCADE',
  })
  groups?: Group[];

  @OneToMany(() => Contact, (contact) => contact.organization, {
    onDelete: 'CASCADE',
  })
  contacts?: Contact[];

  @OneToMany(() => Category, (category) => category.organization, {
    onDelete: 'CASCADE',
  })
  categories?: Category[];

  @OneToMany(
    () => ContactProject,
    (contactProject) => contactProject.organization,
    {
      onDelete: 'CASCADE',
    },
  )
  contactProjects?: ContactProject[];
}
