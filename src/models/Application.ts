import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Generated,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';

@Entity('application')
export class Application extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;
}
