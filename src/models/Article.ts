import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';

@Entity('article')
export class Article extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ default: true })
  status?: boolean;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
  
  @Column({ nullable: true })
  userId?: string;
}
