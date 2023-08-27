import {
  Controller,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Res,
  Req,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';

import { UploadsService } from './uploads.service';
import { getFileToAws } from '../integrations/aws/aws-s3-service-adapter';
import { UploadsDto } from './uploads.dto';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /** Get all faqs */
  @Get(`/products`)
  async findAll(@Res() res, @Query() query: UploadsDto) {
    const { productId, uploadType } = query;

    const uploads = await this.uploadsService.findAll({
      productId,
      uploadType: uploadType.toUpperCase(),
    });

    return reply({ res, results: uploads });
  }

  @Put(`/products/:productId`)
  @UseGuards(JwtAuthGuard)
  async deleteAndUpdate(
    @Res() res,
    @Req() req,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const uploads = await this.uploadsService.findAll({ productId });

    Promise.all(
      uploads.map(async (upload) => {
        await this.uploadsService.updateOne(
          { uploadId: upload?.uid },
          { deletedAt: new Date() },
        );
      }),
    );

    Promise.all(
      req?.body?.newImageLists.map(async (upload) => {
        await this.uploadsService.createOne({ ...upload });
      }),
    );

    Promise.all(
      req?.body?.newFileLists.map(async (upload) => {
        await this.uploadsService.createOne({ ...upload });
      }),
    );

    return reply({ res, results: 'Image upload' });
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

  /** Get on file upload */
  @Get(`/products/:fileName`)
  async getOneFileUploadProduct(
    @Res() res,
    @Param('fileName') fileName: string,
  ) {
    try {
      const { fileBuffer, contentType } = await getFileToAws({
        folder: 'products',
        fileName,
      });
      res.status(200);
      res.contentType(contentType);
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.send(fileBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération de l'image.");
    }
  }
}
