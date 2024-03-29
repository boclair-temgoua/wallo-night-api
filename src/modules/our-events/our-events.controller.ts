import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  PaginationType,
  addPagination,
} from '../../app/utils/pagination/with-pagination';
import { reply } from '../../app/utils/reply';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { UploadsUtil } from '../uploads/uploads.util';
import { UserAuthGuard } from '../users/middleware';
import {
  CreateOrUpdateOurEventsDto,
  GetOneOurEventDto,
  GetOurEventsDto,
} from './our-events.dto';
import { OurEventsService } from './our-events.service';

@Controller('events')
export class OurEventsController {
  constructor(
    private readonly ourEventsService: OurEventsService,
    private readonly uploadsUtil: UploadsUtil,
  ) {}

  /** Get all OurEvents */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() query: GetOurEventsDto,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { userId, status, organizationId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const events = await this.ourEventsService.findAll({
      search,
      pagination,
      userId,
      organizationId,
      status: status?.toUpperCase(),
    });

    return reply({ res, results: events });
  }

  /** Post one OurEvents */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateOurEventsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const {
      title,
      location,
      requirement,
      urlRedirect,
      enableUrlRedirect,
      price,
      address,
      urlMedia,
      currency,
      dateEvent,
      description,
      messageAfterPayment,
    } = body;
    const { user } = req;

    const event = await this.ourEventsService.createOne({
      title,
      price: Number(price),
      description,
      urlRedirect,
      urlMedia,
      address,
      userId: user?.id,
      location,
      requirement,
      currency,
      dateEvent,
      messageAfterPayment,
      organizationId: user?.organizationId,
      enableUrlRedirect: enableUrlRedirect === 'true' ? true : false,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      uploadableId: event?.id,
      model: 'EVENT',
      organizationId: event?.organizationId,
      folder: 'events',
      files,
    });

    return reply({ res, results: event });
  }

  /** Post one OurEvents */
  @Put(`/:eventId`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateOurEventsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    const {
      title,
      location,
      requirement,
      urlRedirect,
      enableUrlRedirect,
      price,
      urlMedia,
      address,
      currency,
      description,
      messageAfterPayment,
    } = body;
    const { user } = req;

    const findOneEvent = await this.ourEventsService.findOneBy({
      eventId,
    });
    if (!findOneEvent)
      throw new HttpException(
        `Event ${eventId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.ourEventsService.updateOne(
      { eventId },
      {
        title,
        price: Number(price),
        description,
        urlRedirect,
        urlMedia,
        address,
        userId: user?.id,
        location,
        requirement,
        currency,
        messageAfterPayment,
        enableUrlRedirect: enableUrlRedirect === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      organizationId: user?.organizationId,
      uploadableId: eventId,
      model: 'EVENT',
      folder: 'events',
      files,
    });

    return reply({ res, results: 'event updated successfully' });
  }

  /** Get one OurEvents */
  @Get(`/show`)
  async getOne(@Res() res, @Query() query: GetOneOurEventDto) {
    const { eventId, eventSlug, userId, organizationId } = query;

    const findOneEvent = await this.ourEventsService.findOneBy({
      eventId,
      userId,
      eventSlug,
      organizationId,
    });
    if (!findOneEvent)
      throw new HttpException(
        `Event ${eventId} ${eventSlug} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneEvent });
  }

  /** Delete one OurEvents */
  @Delete(`/:eventId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    await this.ourEventsService.updateOne(
      { eventId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Event deleted successfully' });
  }
}
