import {
  Controller,
  Post,
  NotFoundException,
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
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';
import axios from 'axios';

@Controller('upload')
export class MediaController {
  constructor() {}

  /** Get one faq */
  @Get(`/user/:fileName`)
  // @UseGuards(JwtAuthGuard)
  async getOneImageUser(@Res() res, @Param('fileName') fileName: string) {
    // const file = await getFile();

    try {
      const imageUrl =
        'https://unpot-dev.s3.eu-west-2.amazonaws.com/galleries/202308116d6fmNc1.png';
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      res.setHeader('Content-Type', 'image/png');
      res.send(imageResponse.data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération de l'image.");
    }
    // console.log('fileName ======+====>', fileName);
    // return res
    //   .status(200)
    //   .download(
    //     'https://unpot-dev.s3.eu-west-2.amazonaws.com/galleries/202308116d6fmNc1.png',
    //   );
    // .json(
    //   'https://unpot-dev.s3.eu-west-2.amazonaws.com/galleries/202308116d6fmNc1.png',
    // );
    // return file
    //   ? res
    //       .status(200)
    //       .contentType(file.contentType)
    //       .set('Cross-Origin-Resource-Policy', 'cross-origin')
    //       .send(file.buffer)
    //   : res.status(404).send();
  }
}
