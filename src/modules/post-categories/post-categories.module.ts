import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from '../../models/PostCategory';
import { PostCategoriesService } from './post-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory])],
  controllers: [],
  providers: [PostCategoriesService],
})
export class PostCategoriesModule {}
