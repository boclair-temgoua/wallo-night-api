import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Conversation } from '../../models';
import { CommentsService } from '../comments/comments.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConversationsUtil } from './conversations.util';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Comment])],
  controllers: [ConversationsController],
  providers: [ConversationsService, CommentsService, ConversationsUtil],
})
export class ConversationsModule {}
