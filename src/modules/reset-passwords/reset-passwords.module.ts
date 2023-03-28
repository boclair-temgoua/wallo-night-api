import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPassword } from '../../models/ResetPassword';
import { ResetPasswordsService } from './reset-passwords.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPassword])],
  controllers: [],
  providers: [ResetPasswordsService],
})
export class ResetPasswordsModule {}
