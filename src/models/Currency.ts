import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../app/databases/common';
import { Contribution } from './Contribution';
import { Membership } from './Membership';
import { Product } from './Product';
import { Profile } from './index';

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

  @Column({ type: 'float', default: 0 })
  amount: number;

  @OneToMany(() => Profile, (profile) => profile.currency)
  profiles: Profile[];

  @OneToMany(() => Product, (product) => product.currency)
  products: Product[];

  @OneToMany(() => Contribution, (contribution) => contribution.currency)
  contributions?: Contribution[];

  @OneToMany(() => Membership, (membership) => membership.currency)
  memberships?: Membership[];
}
