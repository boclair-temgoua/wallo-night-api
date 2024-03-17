import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { FilterQueryType } from '../app/utils/search-query/search-query.dto';
import { ContributorRole } from '../modules/contributors/contributors.type';
import { User } from './User';

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

  @Column({ default: 'ADMIN' })
  role?: ContributorRole;

  @Column({ nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userCreatedId', referencedColumnName: 'id' }])
  userCreated?: Relation<User>;
}
