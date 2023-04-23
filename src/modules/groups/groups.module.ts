import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../../models/Group';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { ContributorsService } from '../contributors/contributors.service';
import { Contributor } from '../../models/Contributor';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Contributor])],
  controllers: [GroupsController],
  providers: [GroupsService, ContributorsService],
})
export class GroupsModule {}
