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
import { Category } from './Category';

@Entity('post_category')
export class PostCategory {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid' })
  postId?: string;
  @ManyToOne(() => Post, (post) => post.postCategories)
  post?: Post[];

  @Column({ type: 'uuid' })
  categoryId?: string;
  @ManyToOne(() => Category, (category) => category.postCategories)
  category?: Category[];
}
