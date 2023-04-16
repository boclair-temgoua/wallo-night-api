import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { ContactProjectsService } from './contact-projects.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  ContactProjectsDto,
  CreateOrUpdateContactProjectsDto,
} from './contact-projects.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { ContactsService } from '../contacts/contacts.service';

@Controller('contact_projects')
export class ContactProjectsController {
  constructor(
    private readonly contactProjectsService: ContactProjectsService,
    private readonly contactsService: ContactsService,
  ) {}

  /** Get all ContactProjects Organization */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllContactProjectsByOrganization(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: ContactProjectsDto,
  ) {
    const {
      type,
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
    } = query;
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contactProjects = await this.contactProjectsService.findAll({
      type,
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
      search,
      pagination,
    });

    return reply({ res, results: contactProjects });
  }

  /** Post one ContactProject */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneContactProject(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateContactProjectsDto,
  ) {
    const {
      type,
      contactId,
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
    } = body;

    const findOneContact = await this.contactsService.findOneBy({
      contactId,
      organizationId,
    });
    if (!findOneContact)
      throw new HttpException(
        `Contact ${contactId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContactProject = await this.contactProjectsService.findOneBy({
      contactId: findOneContact?.id,
      type: type,
      subSubSubProjectId,
      subSubProjectId,
      subProjectId,
      projectId,
      organizationId: organizationId,
    });
    if (findOneContactProject)
      throw new HttpException(
        `This contact already exists in this project please change`,
        HttpStatus.NOT_FOUND,
      );

    const contactProject = await this.contactProjectsService.createOne({
      type,
      contactId,
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
    });

    return reply({ res, results: contactProject });
  }
  // /** Delete one ContactProjectUs */
  // @Delete(`/:ContactProjectId`)
  // @UseGuards(JwtAuthGuard)
  // async deleteOneContactProject(
  //   @Res() res,
  //   @Req() req,
  //   @Body() body: PasswordBodyDto,
  //   @Param('ContactProjectId', ParseUUIDPipe) ContactProjectId: string,
  // ) {
  //   const { user } = req;
  //   if (!user?.checkIfPasswordMatch(body.password))
  //     throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

  //   const findOneContactProject = await this.ContactProjectsService.findOneBy({
  //     ContactProjectId,
  //   });
  //   if (!findOneContactProject)
  //     throw new HttpException(
  //       `ContactProject ${ContactProjectId} don't exist please change`,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   await this.ContactProjectsService.updateOne(
  //     { ContactProjectId: findOneContactProject?.id },
  //     { deletedAt: new Date() },
  //   );

  //   return reply({ res, results: 'ContactProject deleted successfully' });
  // }

  // /** Delete one ContactProjectUs */
  // @Delete(`/delete/multiples`)
  // @UseGuards(JwtAuthGuard)
  // async deleteMultipleContactProject(
  //   @Res() res,
  //   @Req() req,
  //   @Body() body: DeleteMultipleContactProjectsDto & PasswordBodyDto,
  // ) {
  //   const { user } = req;
  //   const { ContactProjects, password } = body;
  //   if (!user?.checkIfPasswordMatch(password))
  //     throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

  //   Promise.all([
  //     ContactProjects.map(async (ContactProjectId) => {
  //       const findOneContactProject =
  //         await this.ContactProjectsService.findOneBy({
  //           ContactProjectId,
  //         });

  //       if (findOneContactProject) {
  //         await this.ContactProjectsService.updateOne(
  //           { ContactProjectId: findOneContactProject?.id },
  //           { deletedAt: new Date() },
  //         );
  //       }
  //     }),
  //   ]);

  //   return reply({ res, results: 'ContactProject deleted successfully' });
  // }
}
