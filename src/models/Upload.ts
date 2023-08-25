import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common/index';

@Entity('upload')
export class Upload extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;
}