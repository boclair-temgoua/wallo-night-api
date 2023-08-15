import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Category, PostCategory } from '../../models';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CategoriesService } from '../categories/categories.service';
import { PostCategoriesService } from '../post-categories/post-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, PostCategory])],
  controllers: [PostsController],
  providers: [PostsService, CategoriesService, PostCategoriesService],
})
export class PostsModule {}
