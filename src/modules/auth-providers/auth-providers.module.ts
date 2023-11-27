import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProvider } from '../../models/AuthProvider';
import { AuthProvidersService } from './auth-providers.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthProvider])],
  controllers: [],
  providers: [AuthProvidersService],
})
export class AuthProvidersModule {}
