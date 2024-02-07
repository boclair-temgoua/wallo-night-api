import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../app/utils/search-query';
import { Organization } from './Organization';

@Entity('cart_order')
export class CartOrder extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'enum', enum: filterQueryTypeArrays, default: 'PRODUCT' })
  model?: FilterQueryType;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.cartOrders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;
}
