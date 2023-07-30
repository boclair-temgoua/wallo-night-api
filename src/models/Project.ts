import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';

@Entity('project')
export class Project extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ default: true })
  isActive?: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;
}
