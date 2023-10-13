import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../app/databases/common';
import { OurEvent } from './OurEvent';
import { Wallet } from './Wallet';
import { User } from './User';

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

  @OneToOne(() => Wallet, (wallet) => wallet.organization, {
    onDelete: 'CASCADE',
  })
  wallet?: Wallet;

  @OneToOne(() => User, (user) => user.organization, {
    onDelete: 'CASCADE',
  })
  user?: User;
}
