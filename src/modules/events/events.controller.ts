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
import { EventsService } from './events.service';
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
  CreateOrUpdateEventsDto,
  GetOneEventDto,
  GetEventsDto,
} from './events.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadsUtil } from '../uploads/uploads.util';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly uploadsUtil: UploadsUtil,
  ) {}

  /** Get all Events */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() query: GetEventsDto,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { userId, status } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const Events = await this.eventsService.findAll({
      search,
      pagination,
      userId,
      status: status?.toUpperCase(),
    });

    return reply({ res, results: Events });
  }

  /** Post one Events */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateEventsDto,
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
      description,
      messageAfterPayment,
    } = body;
    const { user } = req;

    const Event = await this.eventsService.createOne({
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
    });

    // await this.uploadsUtil.saveOrUpdateAws({
    //   uploadableId: Event?.id,
    //   model: 'Event',
    //   userId: Event?.userId,
    //   folder: 'events',
    //   files,
    // });

    return reply({ res, results: Event });
  }

  /** Post one Events */
  @Put(`/:EventId`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateEventsDto,
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

    const findOneEvent = await this.eventsService.findOneBy({
      eventId,
    });
    if (!findOneEvent)
      throw new HttpException(
        `Event ${eventId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.eventsService.updateOne(
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

    // await this.uploadsUtil.saveOrUpdateAws({
    //   userId: user?.id,
    //   uploadableId: EventId,
    //   model: 'Event',
    //   folder: 'Events',
    //   files,
    // });

    return reply({ res, results: 'event updated successfully' });
  }

  /** Get one Events */
  @Get(`/view`)
  async getOne(@Res() res, @Query() query: GetOneEventDto) {
    const { eventId, eventSlug, userId } = query;

    const findOneEvent = await this.eventsService.findOneBy({
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

  /** Delete one Events */
  @Delete(`/:eventId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    await this.eventsService.updateOne({ eventId }, { deletedAt: new Date() });

    return reply({ res, results: 'Event deleted successfully' });
  }
}
