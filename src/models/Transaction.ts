import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { OrderProduct } from './OrderProduct';
import { User } from './User';
import { BaseEntity } from '../app/databases/common/BaseEntity';
import { Organization } from './Organization';

@Entity('transaction')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  slug: string;

  //   @Column({ type: 'uuid', nullable: true })
  //   orderProductId?: string;
  //   @ManyToOne(() => OrderProduct, (orderProduct) => orderProduct.transactions, {
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn()
  //   orderProduct?: OrderProduct;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;

  // @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  // user: User;

  // @OneToMany(() => Amount, (amount) => amount.transactions, { onDelete: 'CASCADE' })
  // amounts: Amount[];
}
