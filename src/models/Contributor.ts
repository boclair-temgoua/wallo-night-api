import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Generated,
  Relation,
} from 'typeorm';
import { ContributorRole } from '../modules/contributors/contributors.type';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';
import { FilterQueryType } from '../app/utils/search-query/search-query.dto';

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

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;
  @ManyToOne(() => User, (user) => user.contributors, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userCreatedId', referencedColumnName: 'id' }])
  userCreated?: Relation<User>;
}
