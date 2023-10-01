import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

import { User } from './index';
import { BaseDeleteEntity } from '../app/databases/common';
@Entity('profile')
export class Profile extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  firstAddress?: string;

  @Column({ nullable: true })
  secondAddress?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  color?: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  user?: User;
}
