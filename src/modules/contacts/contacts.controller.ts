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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { ContactsService } from './contacts.service';
import {
  FilterQueryTypeDto,
  PasswordBodyDto,
  SearchQueryDto,
} from '../../app/utils/search-query/search-query.dto';
import {
  CreateOrUpdateContactsDto,
  DeleteMultipleContactsDto,
} from './contacts.dto';
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
    @Query() query: FilterQueryTypeDto,
  ) {
    const { user } = req;
    const { organizationId, projectId, subProjectId, type } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contacts = await this.contactsService.findAll({
      type: type !== 'ORGANIZATION' && type,
      organizationId: organizationId,
      projectId: projectId,
      subProjectId: subProjectId,
      search,
      pagination,
    });

    return reply({ res, results: contacts });
  }

  /** Get all Contacts Organization */
  @Get(`/organization`)
  @UseGuards(JwtAuthGuard)
  async findAllContactsByOrganization(
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
      organizationId: user?.organizationInUtilizationId,
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
      type,
      description,
      projectId,
      subProjectId,
      categoryId,
      organizationId,
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
      type,
      address,
      description,
      projectId,
      subProjectId,
      categoryId,
      userCreatedId: user?.id,
      image: responseAws?.Location,
      organizationId: organizationId,
    });

    return reply({ res, results: contact });
  }
  /** Post one Contact */
  @Put(`/:contactId`)
  @UseGuards(JwtAuthGuard)
  async updateOneContact(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateContactsDto,
    @Param('categoryId', ParseUUIDPipe) contactId: string,
  ) {
    const {
      firstName,
      lastName,
      phone,
      countryId,
      email,
      address,
      type,
      description,
      projectId,
      subProjectId,
      categoryId,
      organizationId,
    } = body;

    const findOneContact = await this.contactsService.findOneBy({
      contactId,
    });
    if (!findOneContact)
      throw new HttpException(
        `Contact ${contactId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const contact = await this.contactsService.updateOne(
      { contactId },
      {
        firstName,
        lastName,
        phone,
        countryId,
        email,
        address,
        type,
        description,
        projectId,
        subProjectId,
        categoryId,
        organizationId,
      },
    );

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
      contactId,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: contact });
  }

  /** Delete one ContactUs */
  @Delete(`/:contactId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneContact(
    @Res() res,
    @Req() req,
    @Body() body: PasswordBodyDto,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    const { user } = req;
    if (!user?.checkIfPasswordMatch(body.password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const findOneContact = await this.contactsService.findOneBy({
      contactId,
    });
    if (!findOneContact)
      throw new HttpException(
        `Contact ${contactId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.contactsService.updateOne(
      { contactId: findOneContact?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Contact deleted successfully' });
  }

  /** Delete one ContactUs */
  @Delete(`/delete/multiples`)
  @UseGuards(JwtAuthGuard)
  async deleteMultipleContact(
    @Res() res,
    @Req() req,
    @Body() body: DeleteMultipleContactsDto & PasswordBodyDto,
  ) {
    const { user } = req;
    const { contacts, password } = body;
    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    Promise.all([
      contacts.map(async (contactId) => {
        const findOneContact = await this.contactsService.findOneBy({
          contactId,
        });

        if (findOneContact) {
          await this.contactsService.updateOne(
            { contactId: findOneContact?.id },
            { deletedAt: new Date() },
          );
        }
      }),
    ]);

    return reply({ res, results: 'Contact deleted successfully' });
  }
}
