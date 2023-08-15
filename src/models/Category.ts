import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { Product } from './Product';
import { Post } from './Post';
import { PostCategory } from './PostCategory';

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

  @OneToMany(() => Product, (product) => product.category, {
    onDelete: 'CASCADE',
  })
  products?: Product[];

  @OneToMany(() => PostCategory, (postCategory) => postCategory.category, {
    onDelete: 'CASCADE',
  })
  postCategories?: PostCategory[];
}
