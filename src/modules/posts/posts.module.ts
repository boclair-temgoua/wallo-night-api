import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../models/Post';
import { Group } from '../../models/Group';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { GroupsService } from '../groups/groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Group])],
  controllers: [PostsController],
  providers: [PostsService, GroupsService],
})
export class PostsModule {}
