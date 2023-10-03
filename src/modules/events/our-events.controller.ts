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
  HttpStatus,
  HttpException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { OurEventsService } from './our-events.service';
import {
  PasswordBodyDto,
  SearchQueryDto,
} from '../../app/utils/search-query/search-query.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import {
  CreateOrUpdateOurEventsDto,
  GetOneOurEventDto,
  GetOurEventsDto,
} from './our-events.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadsUtil } from '../uploads/uploads.util';

@Controller('events')
export class OurEventsController {
  constructor(
    private readonly ourEventsService: OurEventsService,
    private readonly uploadsUtil: UploadsUtil,
  ) {}

  /** Get all OurEvents */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
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

    const Events = await this.ourEventsService.findAll({
      search,
      pagination,
      userId,
      organizationId,
      status: status?.toUpperCase(),
    });

    return reply({ res, results: Events });
  }

  /** Post one OurEvents */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
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
      userId: event?.userId,
      folder: 'events',
      files,
    });

    return reply({ res, results: event });
  }

  /** Post one OurEvents */
  @Put(`/:eventId`)
  @UseGuards(JwtAuthGuard)
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
        userId: user?.id,
        location,
        requirement,
        currency,
        messageAfterPayment,
        enableUrlRedirect: enableUrlRedirect === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      userId: user?.id,
      uploadableId: eventId,
      model: 'EVENT',
      folder: 'events',
      files,
    });

    return reply({ res, results: 'event updated successfully' });
  }

  /** Get one OurEvents */
  @Get(`/view`)
  async getOne(@Res() res, @Query() query: GetOneOurEventDto) {
    const { eventId, eventSlug, userId } = query;

    const findOneEvent = await this.ourEventsService.findOneBy({
      eventId,
      userId,
      eventSlug,
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
  @UseGuards(JwtAuthGuard)
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
