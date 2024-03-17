import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { User } from './index';
@Entity('provider')
export class Provider extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'enum',
    enum: ['GOOGLE', 'FACEBOOK', 'GITHUB'],
    default: 'GOOGLE',
  })
  name?: 'GOOGLE' | 'FACEBOOK' | 'GITHUB';

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  providerId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.providers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;
}
