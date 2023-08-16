import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Category, PostCategory,Follow } from '../../models';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CategoriesService } from '../categories/categories.service';
import { PostCategoriesService } from '../post-categories/post-categories.service';
import { FollowsService } from '../follows/follows.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, PostCategory,Follow])],
  controllers: [PostsController],
  providers: [PostsService, CategoriesService, PostCategoriesService,FollowsService],
})
export class PostsModule {}
