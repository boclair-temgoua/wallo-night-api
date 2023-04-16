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
import { Organization } from './Organization';
import { Category } from './Category';
import { ContactProject } from './ContactProject';

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

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string;
  @ManyToOne(() => Category, (category) => category.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category?: Category;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @OneToMany(() => ContactProject, (contactProject) => contactProject.contact, {
    onDelete: 'CASCADE',
  })
  contactProjects?: ContactProject[];
}
