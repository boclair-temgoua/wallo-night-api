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

import { BaseDeleteEntity } from '../app/databases/common';
import {
  Post,
  Comment,
  Wallet,
  Transaction,
  Contributor,
  Profile,
  Event,
} from './index';

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

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'uuid', nullable: true })
  profileId?: string;
  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile?: Profile;

  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    onDelete: 'CASCADE',
  })
  wallet?: Wallet;

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @OneToMany(() => Event, (event) => event.user)
  events?: Event[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  transactions?: Transaction[];

  @OneToMany(() => Contributor, (contributor) => contributor.user, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  async hashPassword(password: string) {
    this.password = await bcrypt.hashSync(
      String(password) || String(this.password),
      8,
    );
  }

  checkIfPasswordMatch(password: string) {
    return bcrypt.compareSync(String(password), String(this.password));
  }
}
