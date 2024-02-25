import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import {
  Comment,
  Contributor,
  Organization,
  OurEvent,
  Post,
  Profile,
  Transaction,
} from './index';
import { OrderEvent } from './OrderEvent';

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

  @Column({ unique: true, nullable: true })
  username?: string;

  @Column({ default: 'USER', nullable: true })
  permission?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  profileId?: string;
  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile?: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @OneToMany(() => OurEvent, (ourEvent) => ourEvent.user)
  ourEvents?: OurEvent[];

  @OneToMany(() => OrderEvent, (orderEvent) => orderEvent.user)
  orderEvents?: OrderEvent[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  transactions?: Transaction[];

  @OneToMany(() => Contributor, (contributor) => contributor.user, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];
}
