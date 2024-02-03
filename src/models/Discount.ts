import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Commission, User } from '.';
import { BaseDeleteEntity } from '../app/databases/common';
import { Product } from './Product';
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

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ default: false })
  enableExpiredAt: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  startedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.discounts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => Product, (product) => product.discount)
  products: Product[];

  @OneToMany(() => Commission, (commission) => commission.discount)
  commissions: Commission[];
}
