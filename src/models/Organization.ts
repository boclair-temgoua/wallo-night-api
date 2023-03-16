import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Generated,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Contributor } from './Contributor';
import { UserAddress } from './UserAddress';

@Entity('organization')
export class Organization extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: false })
  requiresPayment?: boolean;

  @Column({ nullable: true })
  color?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @OneToMany(() => Contributor, (contributor) => contributor.organization, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.organization)
  userAddress?: UserAddress[];

  @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => User, (user) => user.organizationInUtilization, {
    onDelete: 'CASCADE',
  })
  users?: User[];
}
