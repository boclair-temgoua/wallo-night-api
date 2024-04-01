import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { Upload } from './Upload';

@Entity('contact')
export class Contact extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: false })
  isRed?: boolean;

  @Column({ nullable: true })
  ipLocation?: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  countryId?: number;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userCreatedId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @OneToMany(() => Upload, (upload) => upload.contact, {
    onDelete: 'CASCADE',
  })
  uploads?: Upload;
}
