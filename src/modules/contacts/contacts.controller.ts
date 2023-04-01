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
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  /** Get all contacts */
  @Get(`/`)
  async findAllContacts(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contacts = await this.contactsService.findAll({ search, pagination });

    return reply({ res, results: contacts });
  }

  @Get(`/organizations`)
  @UseGuards(JwtAuthGuard)
  async findAllContactsByOrganizationId(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contacts = await this.contactsService.findAll({
      search,
      pagination,
      option1: { organizationId: user?.organizationInUtilizationId },
    });

    return reply({ res, results: contacts });
  }

  /** Post one contact */
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

  /** Delete one contact */
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
