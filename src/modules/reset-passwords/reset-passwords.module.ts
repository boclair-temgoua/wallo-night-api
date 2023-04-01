import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPassword } from '../../models/ResetPassword';
import { ResetPasswordsService } from './reset-passwords.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetPassword]),
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 5,
    // }),
  ],
  controllers: [],
  providers: [
    ResetPasswordsService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class ResetPasswordsModule {}
