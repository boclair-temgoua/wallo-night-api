import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './Product';
import { Profile } from './Profile';
import { User } from './User';
import { BaseEntity } from '../app/databases/common/BaseEntity';

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

  // @OneToMany(() => Profile, (profile) => profile.currency)
  // profiles: Profile[];
}
