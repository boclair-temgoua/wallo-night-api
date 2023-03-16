import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../../models/Profile';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [],
  providers: [ProfilesService],
})
export class ProfilesModule {}
