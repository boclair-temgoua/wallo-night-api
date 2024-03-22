import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { FilterQueryType } from '../app/utils/search-query';
import {
  ContributorRole,
  ContributorStatus,
  contributorStatusArrays,
} from '../modules/contributors/contributors.type';
import { Organization, User } from './index';

@Entity('contributor')
export class Contributor extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ default: 'ORGANIZATION' })
  type?: FilterQueryType;

  @Column({
    type: 'enum',
    enum: contributorStatusArrays,
    default: 'CONTRIBUTOR',
  })
  status?: ContributorStatus;

  @Column({ default: 'ADMIN' })
  role?: ContributorRole;

  @Column({ nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.contributors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userCreatedId', referencedColumnName: 'id' }])
  userCreated?: Relation<User>;
}
