import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Generated,
  Relation,
} from 'typeorm';

import { User, Currency } from './index';
import { BaseDeleteEntity } from '../app/databases/common';
@Entity('auth_provider')
export class AuthProvider extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  providerId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.authProviders)
  @JoinColumn()
  user?: Relation<User>;
}
