import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../app/databases/common';
import { User } from './User';

@Entity('wallet')
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: false, unique: true })
  accountId?: string;

  @Column({ type: 'float', default: 0 })
  amount: number;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: Relation<User>;
}
