import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { UploadsUtil } from '../uploads/uploads.util';
import { UserAuthGuard } from '../users/middleware';
import { CreateOrUpdateContactDto } from './contact.dto';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(
    private readonly uploadsUtil: UploadsUtil,
    private readonly contactService: ContactService,
  ) {}

  /** Get all ContactUs */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contact = await this.contactService.findAll({
      search,
      pagination,
    });

    return reply({ res, results: contact });
  }

  /** Post one ContactUs */
  @Post(`/`)
  @UseInterceptors(AnyFilesInterceptor())
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateContactDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { subject, fullName, phone, email, description } = body;

    const contact = await this.contactService.createOne({
      subject,
      fullName,
      phone,
      email,
      description,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      contactId: contact?.id,
      uploadableId: contact?.id,
      model: 'CONTACT',
      folder: 'contacts',
      files,
      organizationId: null,
    });

    return reply({ res, results: 'Contact send successfully' });
  }

  /** Get one Contact */
  @Get(`/show/:contactId`)
  @UseGuards(UserAuthGuard)
  async getOneByIdUser(
    @Res() res,
    @Param('contactUsId', ParseUUIDPipe) contactId: string,
  ) {
    const user = await this.contactService.findOneBy({ contactId });

    return reply({ res, results: user });
  }

  /** Delete one ContactUs */
  @Delete(`/delete/:contactId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    const contact = await this.contactService.updateOne(
      { contactId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: contact });
  }
}
