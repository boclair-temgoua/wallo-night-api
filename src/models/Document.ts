import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DocumentType } from '../modules/documents/documents.type';
import { Profile } from './Profile';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Organization } from './Organization';
import { Project } from './Project';
import { SubProject } from './SubProject';

@Entity('document')
export class Document extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.ORGANIZATION,
  })
  type?: DocumentType;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  projectId?: string;
  @ManyToOne(() => Project, (project) => project.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project?: Project;

  @Column({ type: 'uuid', nullable: true })
  subProjectId?: string;
  @ManyToOne(() => SubProject, (subProject) => subProject.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subProject?: SubProject;
}
