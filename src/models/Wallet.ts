import { Entity, PrimaryGeneratedColumn, Column, Generated, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { BaseEntity } from '../app/databases/common/BaseEntity';
import { User } from './User';

@Entity('wallet')
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ default: false, unique: true })
  accountId?: string;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.wallets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;
}
