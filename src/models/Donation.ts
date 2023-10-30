import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Relation,
  OneToOne,
} from 'typeorm';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';

@Entity('donation')
export class Donation extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  messageWelcome: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @OneToOne(() => User, (user) => user.donation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;
}
