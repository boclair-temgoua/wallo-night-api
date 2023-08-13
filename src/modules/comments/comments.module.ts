import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Post, Gallery } from '../../models';
import { CommentsController } from './comments.controller';
import { GalleriesService } from '../galleries/galleries.service';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Gallery, Post])],
  controllers: [CommentsController],
  providers: [CommentsService, GalleriesService, PostsService],
})
export class CommentsModule {}
