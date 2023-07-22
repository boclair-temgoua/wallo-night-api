import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';

@Entity('testimonial')
export class Testimonial extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  occupation?: string;

  @Column({ nullable: true })
  rete?: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
}
