import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from '../../models/Provider';
import { ProvidersService } from './providers.service';

@Module({
    imports: [TypeOrmModule.forFeature([Provider])],
    controllers: [],
    providers: [ProvidersService],
})
export class ProvidersModule {}
