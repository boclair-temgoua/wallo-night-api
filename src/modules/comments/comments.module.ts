import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Post } from '../../models';
import { CommentsController } from './comments.controller';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [CommentsController],
  providers: [CommentsService, PostsService],
})
export class CommentsModule {}
