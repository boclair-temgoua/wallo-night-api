import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { BaseEntity } from './BaseEntity';

export class BaseDeleteEntity extends BaseEntity {
  @Column({ nullable: true })
  deletedAt?: Date;
}
