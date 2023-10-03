import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../app/databases/common';
import { OurEvent } from './OurEvent';

@Entity('organization')
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  firstAddress?: string;

  @Column({ nullable: true })
  secondAddress?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @OneToMany(() => OurEvent, (ourEvent) => ourEvent.organization)
  ourEvents?: OurEvent[];
}
