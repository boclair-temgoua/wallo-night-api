import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
