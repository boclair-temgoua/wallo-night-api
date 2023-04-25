import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../models/Comment';
import { Document } from '../../models/Document';
import { Post } from '../../models/Post';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { DocumentsService } from '../documents/documents.service';
import { PostsService } from '../posts/posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Document, Post])],
  controllers: [CommentsController],
  providers: [CommentsService, DocumentsService, PostsService],
})
export class CommentsModule {}
