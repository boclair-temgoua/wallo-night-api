import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';

@Entity('country')
export class Country extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: false })
  code?: string;

  @Column({ nullable: true })
  name?: string;
}
