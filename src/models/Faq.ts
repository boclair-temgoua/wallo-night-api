import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';

@Entity('faq')
export class Faq extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ default: true })
  status?: boolean;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  userCreatedId?: string;

  @Column({ nullable: true })
  userId?: string;
}
