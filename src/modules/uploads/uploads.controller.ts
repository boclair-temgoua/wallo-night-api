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
import { Readable } from 'stream';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /** Get all uploads */
  @Get(`/`)
  async findAll(@Res() res, @Query() query: UploadsDto) {
    const { model, userId, uploadableId, uploadType } = query;

    const uploads = await this.uploadsService.findAll({
      userId,
      uploadableId,
      model: model?.toUpperCase(),
      uploadType: uploadType.toUpperCase(),
    });

    return reply({ res, results: uploads });
  }

  @Put(`/update`)
  @UseGuards(JwtAuthGuard)
  async deleteAndUpdate(@Res() res, @Req() req, @Query() query: UploadsDto) {
    const { model, userId, uploadableId } = query;
    const newFileLists = req?.body?.newFileLists;
    const newImageLists = req?.body?.newImageLists;

    const uploads = await this.uploadsService.findAll({
      userId,
      uploadableId,
      model: model?.toUpperCase(),
    });

    for (const upload of uploads) {
      await this.uploadsService.deleteOne({ uploadId: upload?.id });
    }

    if (newFileLists && newFileLists.length > 0) {
      for (const upload of newFileLists) {
        await this.uploadsService.createOne({ ...upload });
      }
    }

    if (newImageLists && newImageLists.length > 0) {
      for (const upload of newImageLists) {
        await this.uploadsService.createOne({ ...upload });
      }
    }

    return reply({ res, results: 'Image upload' });
  }

  /** Get on file upload */
  @Get(`/:folder/:fileName`)
  async getOneFileUploadProduct(
    @Res() res,
    @Param('folder') folder: string,
    @Param('fileName') fileName: string,
  ) {
    try {
      const { fileBuffer, contentType } = await getFileToAws({
        folder,
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

  /** Get on file upload */
  @Get(`/download/:folder/:fileName`)
  async getOneFileUploadDownload(
    @Res() res,
    @Param('folder') folder: string,
    @Param('fileName') fileName: string,
  ) {
    try {
      const { fileBuffer, contentType } = await getFileToAws({
        folder,
        fileName,
      });
      const readStream = Readable.from([fileBuffer]);

      res.status(200);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.contentType(contentType);
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      readStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération de l'image.");
    }
  }
}
