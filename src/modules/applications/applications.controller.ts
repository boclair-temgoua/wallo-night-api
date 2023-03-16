import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Request,
  Put,
  Res,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { ApplicationsService } from './applications.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CreateOrUpdateApplicationDto } from './applications.dto';
import { JwtAuthGuard } from '../users/middleware';
import { generateLongUUID } from '../../app/utils/commons/generate-random';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllApplications(
    @Res() res,
    @Req() req,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const applications = await this.applicationsService.findAll({
      option1: { userId: user?.organizationInUtilization?.userId },
      search: String(search || ''),
    });

    return reply({ res, results: applications });
  }

  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneApplication(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateApplicationDto: CreateOrUpdateApplicationDto,
  ) {
    const { user } = req;
    const { name } = createOrUpdateApplicationDto;

    const application = await this.applicationsService.createOne({
      name,
      userCreatedId: user?.id,
      organizationId: user?.organizationInUtilizationId,
      userId: user?.organizationInUtilization?.userId,
    });

    return reply({ res, results: application });
  }

  @Put(`/regenerate/:applicationId`)
  @UseGuards(JwtAuthGuard)
  async regenerateTokenApplication(
    @Res() res,
    @Req() req,
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
  ) {
    const application = await this.applicationsService.updateOne(
      { option1: { applicationId } },
      { token: generateLongUUID(50) },
    );

    return reply({ res, results: application });
  }

  @Delete(`/delete/:applicationId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneApplication(
    @Res() res,
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
  ) {
    const application = await this.applicationsService.updateOne(
      { option1: { applicationId } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: application });
  }
}
