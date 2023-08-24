import {
  Controller,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';

import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /** Get all faqs */
  @Get(`/products/:productId`)
  async findAll(
    @Res() res,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const uploads = await this.uploadsService.findAll({ productId });

    return reply({ res, results: uploads });
  }

  /** Delete upload */
  @Delete(`/:uploadId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('uploadId', ParseUUIDPipe) uploadId: string,
  ) {
    // const findOneFaq = await this.uploadsService.findOneBy({ faqId });
    // if (!findOneFaq)
    //   throw new HttpException(
    //     `This faq ${faqId} dons't exist please change`,
    //     HttpStatus.NOT_FOUND,
    //   );

    // const faq = await this.faqsService.updateOne(
    //   { faqId: findOneFaq?.id },
    //   { deletedAt: new Date() },
    // );

    return reply({ res, results: '' });
  }
}
