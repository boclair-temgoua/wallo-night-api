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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { ContactsService } from './contacts.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CreateOrUpdateContactsDto, FilterContactDto } from './contacts.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { FileInterceptor } from '@nestjs/platform-express';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';
import { generateLongUUID } from '../../app/utils/commons';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  /** Get all Contacts */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllContacts(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: FilterContactDto,
  ) {
    const { user } = req;
    const { organizationId, projectId, subProjectId, type } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contacts = await this.contactsService.findAll({
      type,
      organizationId: organizationId,
      projectId: projectId,
      subProjectId: subProjectId,
      search,
      pagination,
    });

    return reply({ res, results: contacts });
  }

  /** Post one Contact */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createOneContact(
    @Res() res,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateOrUpdateContactsDto,
  ) {
    const { user } = req;

    const {
      firstName,
      lastName,
      phone,
      countryId,
      email,
      address,
      description,
      projectId,
      subProjectId,
      categoryId,
    } = body;

    const responseAws = await awsS3ServiceAdapter({
      name: generateLongUUID(10),
      mimeType: file?.mimetype,
      folder: 'contact',
      file: file?.buffer,
    });

    const contact = await this.contactsService.createOne({
      firstName,
      lastName,
      phone,
      countryId,
      email,
      address,
      description,
      projectId,
      subProjectId,
      categoryId,
      userCreatedId: user?.id,
      image: responseAws?.Location,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: contact });
  }

  /** Get one Contact */
  @Get(`/show/:contactId`)
  @UseGuards(JwtAuthGuard)
  async getOneByIdUser(
    @Res() res,
    @Req() req,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    const { user } = req;

    const contact = await this.contactsService.findOneBy({
      option1: { contactId, organizationId: user?.organizationInUtilizationId },
    });

    return reply({ res, results: contact });
  }

  /** Delete one ContactUs */
  @Delete(`/delete/:contactId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneContact(
    @Res() res,
    @Req() req,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    const { user } = req;

    const contactUs = await this.contactsService.updateOne(
      {
        option1: {
          contactId,
          organizationId: user?.organizationInUtilizationId,
        },
      },
      { deletedAt: new Date() },
    );

    return reply({ res, results: contactUs });
  }
}
