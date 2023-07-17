import { BaseDeleteEntity } from './../app/databases/common/BaseDeleteEntity';
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
import { User } from './User';
import { Organization } from './Organization';

@Entity('discount')
export class Discount extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'bigint' })
  percent: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  expiredAt: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  startedAt: Date;

  @OneToMany(() => Product, (product) => product.discount)
  products: Product[];

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.discounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization: Organization;
}
