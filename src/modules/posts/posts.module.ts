import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Category, Upload } from '../../models';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CategoriesService } from '../categories/categories.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, Upload])],
  controllers: [PostsController],
  providers: [PostsService, CategoriesService, UploadsUtil, UploadsService],
})
export class PostsModule {}
