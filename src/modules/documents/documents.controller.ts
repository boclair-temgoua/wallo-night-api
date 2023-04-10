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
  UploadedFiles,
  HttpStatus,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { reply } from '../../app/utils/reply';

import { DocumentsService } from './documents.service';
import {
  FilterQueryType,
  SearchQueryDto,
  FilterQueryTypeDto,
} from '../../app/utils/search-query/search-query.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { CreateDocumentDto } from './documents.dto';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';
import { generateLongUUID, generateNumber } from '../../app/utils/commons';
import { SubProjectsService } from '../sub-projects/sub-projects.service';
import { mineTypeFile } from '../../app/utils/commons/key-as-string';
import { ProjectsService } from '../projects/projects.service';
import { ContributorsService } from '../contributors/contributors.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly projectsService: ProjectsService,
    private readonly contributorsService: ContributorsService,
    private readonly subProjectsService: SubProjectsService,
  ) {}

  /** Get all documents */
  @Get(`/`)
  async findAllDocuments(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: FilterQueryTypeDto,
  ) {
    const { user } = req;
    const { type, organizationId, projectId, subProjectId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contacts = await this.documentsService.findAll({
      type: type,
      organizationId: organizationId,
      projectId: projectId,
      subProjectId: subProjectId,
      search,
      pagination,
    });

    return reply({ res, results: contacts });
  }

  /** Post one Document */
  @Post(`/organization`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createOneDocumentByOrganizationId(
    @Res() res,
    @Req() req,
    @Body() body: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    // @Query('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;
    const { title, description } = body;

    const bucketKey = `${title} ${generateLongUUID(10)}`;
    const responseAws = await awsS3ServiceAdapter({
      name: bucketKey,
      mimeType: file?.mimetype,
      folder: FilterQueryType.ORGANIZATION.toLowerCase(),
      file: file?.buffer,
    });

    /** Create Document */
    await this.documentsService.createOne({
      title: title,
      description: description,
      url: responseAws?.Location,
      type: FilterQueryType.ORGANIZATION,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: 'document save successfully' });
  }

  /** Post one Document */
  @Post(`/project`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createOneDocumentByProjectId(
    @Res() res,
    @Req() req,
    @Body() body: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Query('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const { user } = req;
    const { title, description } = body;

    const getOneProject = await this.projectsService.findOneBy({
      option1: { projectId },
    });
    if (!getOneProject)
      throw new HttpException(
        `Project ${projectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorProject =
      await this.contributorsService.canCheckPermissionProject({
        userId: user?.id,
        project: getOneProject,
      });
    if (!findOneContributorProject)
      throw new UnauthorizedException(
        `Not authorized in this project ${projectId}`,
      );

    const bucketKey = `${title} ${generateLongUUID(10)}`;
    const responseAws = await awsS3ServiceAdapter({
      name: bucketKey,
      mimeType: file?.mimetype,
      folder: FilterQueryType.PROJECT.toLowerCase(),
      file: file?.buffer,
    });

    /** Create Document */
    await this.documentsService.createOne({
      title: title,
      description: description,
      url: responseAws?.Location,
      type: FilterQueryType.PROJECT,
      typeFile: mineTypeFile[file?.mimetype],
      projectId: getOneProject?.id,
      organizationId: getOneProject?.organizationId,
    });

    return reply({ res, results: 'document save successfully' });
  }

  /** Post one Document */
  @Post(`/sub-project`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createOneDocumentBySubProjectId(
    @Res() res,
    @Req() req,
    @Body() body: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Query('subProjectId', ParseUUIDPipe) subProjectId: string,
  ) {
    const { user } = req;
    const { title, description } = body;

    const getOneSubProject = await this.subProjectsService.findOneBy({
      subProjectId,
    });
    if (!getOneSubProject)
      throw new HttpException(
        `Sub project ${subProjectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorSubProject =
      await this.contributorsService.canCheckPermissionSubProject({
        userId: user?.id,
        subProject: getOneSubProject,
      });
    if (!findOneContributorSubProject)
      throw new UnauthorizedException(
        `Not authorized in this project ${subProjectId}`,
      );

    const bucketKey = `${title} ${generateLongUUID(10)}`;
    const responseAws = await awsS3ServiceAdapter({
      name: bucketKey,
      mimeType: file?.mimetype,
      folder: FilterQueryType.PROJECT.toLowerCase(),
      file: file?.buffer,
    });

    /** Create Document */
    await this.documentsService.createOne({
      title: title,
      description: description,
      url: responseAws?.Location,
      type: FilterQueryType.SUBPROJECT,
      projectId: getOneSubProject?.projectId,
      subProjectId: getOneSubProject?.id,
      organizationId: getOneSubProject?.organizationId,
    });

    return reply({ res, results: 'document save successfully' });
  }

  /** Delete one Document */
  @Delete(`/delete/:documentId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneDocument(
    @Res() res,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    const document = await this.documentsService.updateOne(
      { option1: { documentId } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: document });
  }
}
