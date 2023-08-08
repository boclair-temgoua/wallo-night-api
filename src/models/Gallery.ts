import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { Product } from './Product';
import { User } from './User';
import { WhoCanSeeType } from '../app/utils/search-query/search-query.dto';

@Entity('gallery')
export class Gallery extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({
    type: 'enum',
    enum: WhoCanSeeType,
    default: WhoCanSeeType.PUBLIC,
  })
  whoCanSee?: WhoCanSeeType;

  @Column({ default: true })
  allowDownload?: boolean;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.galleries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;
}
