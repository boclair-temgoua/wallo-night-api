import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Category, PostCategory, Follow, Upload } from '../../models';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CategoriesService } from '../categories/categories.service';
import { PostCategoriesService } from '../post-categories/post-categories.service';
import { FollowsService } from '../follows/follows.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, PostCategory, Follow, Upload]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    CategoriesService,
    PostCategoriesService,
    FollowsService,
    UploadsUtil,
    UploadsService,
  ],
})
export class PostsModule {}
