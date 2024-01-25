import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Follow, Post, Upload } from '../../models';
import { CategoriesService } from '../categories/categories.service';
import { FollowsService } from '../follows/follows.service';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, Follow, Upload])],
  controllers: [PostsController],
  providers: [
    PostsService,
    CategoriesService,
    FollowsService,
    UploadsUtil,
    UploadsService,
  ],
})
export class PostsModule {}
