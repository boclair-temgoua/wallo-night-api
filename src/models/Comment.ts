import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Document } from './Document';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';

@Entity('comment')
export class Comment extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  documentId?: string;
  @ManyToOne(() => Document, (document) => document.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  document?: Document;
}
