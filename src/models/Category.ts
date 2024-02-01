import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { Post, Product } from './index';

@Entity('category')
export class Category extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];

  @OneToMany(() => Post, (post) => post.category)
  posts?: Post[];
}
