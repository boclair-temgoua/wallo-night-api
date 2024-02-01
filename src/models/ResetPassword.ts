import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';

@Entity('reset_password')
export class ResetPassword extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ nullable: true })
  token?: string;
}
