import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Product } from './Product';
import { BaseEntity } from '../app/databases/common';
import { Donation } from './Donation';
import { Gift } from './Gift';

@Entity('currency')
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  symbol: string;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @OneToMany(() => Product, (product) => product.currency)
  products: Product[];

  @OneToMany(() => Donation, (donation) => donation.organization)
  donations?: Donation[];

  @OneToMany(() => Gift, (gift) => gift.currency)
  gifts?: Gift[];
}
