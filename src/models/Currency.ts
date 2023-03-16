import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Generated,
} from 'typeorm';

import { Profile } from './Profile';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';

@Entity('currency')
export class Currency extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: true })
  status?: boolean;

  @Column({ nullable: true })
  code?: string;

  @Column({ nullable: true })
  symbol?: string;

  @Column({ type: 'float', nullable: true })
  amount?: number;

  @OneToMany(() => Profile, (profile) => profile.currency)
  profiles?: Profile[];
}
