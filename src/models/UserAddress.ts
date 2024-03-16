import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { Organization } from './Organization';
import { User } from './User';

@Entity('user_address')
export class UserAddress extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  cap?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  street1?: string;

  @Column({ nullable: true })
  street2?: string;

  @Column({ default: false })
  isUpdated?: boolean;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @OneToOne(() => User, (user) => user.userAddress, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  // @Column({ type: 'uuid', nullable: true })
  // profileId?: string;
  // @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  // @JoinColumn()
  // profile?: Profile;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @OneToOne(() => Organization, (organization) => organization.userAddress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;
}
