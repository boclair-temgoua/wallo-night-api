import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';
import { BaseEntity } from '../app/databases/common/BaseEntity';

@Entity('country')
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: false })
  code?: string;

  @Column({ nullable: true })
  name?: string;
}
