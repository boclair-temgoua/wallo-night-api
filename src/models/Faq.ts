import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';

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
