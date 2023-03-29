import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Put,
  Res,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { ContactsService } from './contacts.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CreateOrUpdateContactDto } from './contacts.dto';
import { JwtAuthGuard } from '../users/middleware';
import { generateLongUUID } from '../../app/utils/commons/generate-random';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllContacts(
    @Res() res,
    @Req() req,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const Contacts = await this.contactsService.findAll({
      search: String(search || ''),
    });

    return reply({ res, results: Contacts });
  }

  @Post(`/`)
  async createOneContact(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateContactDto: CreateOrUpdateContactDto,
  ) {
    const { subject, fullName, phone, email, description } =
      createOrUpdateContactDto;

    const Contact = await this.contactsService.createOne({
      subject,
      fullName,
      phone,
      email,
      description,
    });

    return reply({ res, results: Contact });
  }

  /** Get one contact */
  @Get(`/show/:contactId`)
  @UseGuards(JwtAuthGuard)
  async getOneByIdUser(
    @Res() res,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    const user = await this.contactsService.findOneBy({
      option1: { contactId },
    });

    return reply({ res, results: user });
  }

  @Delete(`/delete/:contactId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneContact(
    @Res() res,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    const contact = await this.contactsService.updateOne(
      { option1: { contactId } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: contact });
  }
}
