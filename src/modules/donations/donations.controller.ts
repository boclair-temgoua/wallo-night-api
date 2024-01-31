import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';
import { UpdateDonationsDto } from './donations.dto';
import { DonationsService } from './donations.service';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  /** Post one Donation */
  @Put(`/:donationId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: UpdateDonationsDto,
    @Param('donationId', ParseUUIDPipe) donationId: string,
  ) {
    const { title, price, messageWelcome, description } = body;
    const findOneDonation = await this.donationsService.findOneBy({
      donationId,
    });
    if (!findOneDonation)
      throw new HttpException(
        `Donation ${donationId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.donationsService.updateOne(
      { donationId },
      {
        title,
        price,
        description,
        messageWelcome,
      },
    );

    return reply({ res, results: 'Donation updated successfully' });
  }

  /** Get one Donation */
  @Get(`/show/:donationId`)
  async getOne(
    @Res() res,
    @Param('donationId', ParseUUIDPipe) donationId: string,
  ) {
    const findOneDonation = await this.donationsService.findOneBy({
      donationId,
    });
    if (!findOneDonation)
      throw new HttpException(
        `Donation ${donationId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneDonation });
  }
}
