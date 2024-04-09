import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Conversation, Organization, User } from '../../models';
import { CommentsService } from '../comments/comments.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { UsersService } from '../users/users.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConversationsUtil } from './conversations.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Comment, Organization, User]),
  ],
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    CommentsService,
    UsersService,
    ConversationsUtil,
    OrganizationsService,
  ],
})
export class ConversationsModule {}
