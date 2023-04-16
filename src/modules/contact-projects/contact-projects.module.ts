import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactProject } from '../../models/ContactProject';
import { Contact } from '../../models/Contact';
import { ContactProjectsController } from './contact-projects.controller';
import { ContactProjectsService } from './contact-projects.service';
import { ContactsService } from '../contacts/contacts.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContactProject, Contact])],
  controllers: [ContactProjectsController],
  providers: [ContactProjectsService, ContactsService],
})
export class ContactProjectsModule {}
