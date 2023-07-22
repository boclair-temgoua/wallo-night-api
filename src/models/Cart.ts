import { StatusCart } from './../modules/cats/cats.dto';
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

@Entity('cart')
export class Cart extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'enum',
    enum: StatusCart,
    default: StatusCart.ADDED,
  })
  status?: StatusCart;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'bigint', nullable: true })
  quantity: number;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;
  @ManyToOne(() => Product, (product) => product.orderProducts)
  @JoinColumn()
  product?: Relation<Product>;
}
