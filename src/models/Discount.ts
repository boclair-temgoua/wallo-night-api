import { BaseDeleteEntity } from '../app/databases/common';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Product } from './Product';
import { User } from '.';
@Entity('discount')
export class Discount extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'bigint', default: 0 })
  percent: number;

  @Column({ nullable: true, type: 'timestamptz' })
  expiredAt: Date;

  @Column({ default: false })
  enableExpiredAt: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  startedAt: Date;

  @OneToMany(() => Product, (product) => product.discount)
  products: Product[];

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.discounts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;
}
