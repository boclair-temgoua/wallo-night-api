import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToMany,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { Organization, Post } from './index';

@Entity('album')
export class Album extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @OneToMany(() => Post, (post) => post.album)
  posts?: Post[];
}
