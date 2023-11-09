import { StatusCart } from '../modules/cats/cats.dto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
  Relation,
} from 'typeorm';

import { Product } from './Product';
import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';

@Entity('cart_order')
export class CartOrder extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
}
