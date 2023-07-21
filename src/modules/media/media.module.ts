import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from '../../models/Faq';
import { MediaController } from './media.controller';

@Module({
  controllers: [MediaController],
})
export class MediaModule {}
