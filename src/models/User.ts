import * as bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Generated,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Profile } from './Profile';
import { Organization } from './Organization';
import { Contributor } from './Contributor';
import { Project } from './Project';

@Entity('user')
export class User extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  confirmedAt?: Date;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column('simple-array', { nullable: true })
  accessToken?: string[];

  @Column('simple-array', { nullable: true })
  refreshToken?: string[];

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'uuid', nullable: true })
  profileId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationInUtilizationId?: string;

  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile?: Profile;

  @OneToMany(() => Contributor, (contributor) => contributor.userCreated, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Organization, (organization) => organization.user, {
    onDelete: 'CASCADE',
  })
  organizations?: Organization[];

  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'organizationInUtilizationId', referencedColumnName: 'id' },
  ])
  organizationInUtilization?: Organization;

  async hashPassword(password: string) {
    this.password = await bcrypt.hashSync(password || this.password, 8);
  }

  checkIfPasswordMatch(password: string) {
    return bcrypt.compareSync(password, String(this.password));
  }
}
