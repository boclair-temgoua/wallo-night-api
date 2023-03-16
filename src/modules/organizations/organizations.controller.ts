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
  ParseIntPipe,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { useCatch } from '../../app/utils/use-catch';
//import { JwtAuthGuard } from '../../user/middleware';

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get(`/show_by_uuid/:organization_uuid`)
  //@UseGuards(JwtAuthGuard)
  async getOneByUUIDOrganization(
    @Res() res,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const [error, result] = await useCatch(
      this.organizationsService.findOneBy({ option1: { organizationId } }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Get(`/show_by_id/:organizationId`)
  //@UseGuards(JwtAuthGuard)
  async getOneByIdOrganization(
    @Res() res,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const [error, result] = await useCatch(
      this.organizationsService.findOneBy({ option1: { organizationId } }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}
