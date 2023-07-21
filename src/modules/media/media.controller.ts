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
import { getFile } from 's3';

@Controller('upload')
export class MediaController {
  constructor() {}

  /** Get one faq */
  // @Get(`/user/:fileName`)
  // @UseGuards(JwtAuthGuard)
  // async getOneImageUser(@Res() res, @Param('fileName') fileName: string) {


  //   const file = await getFile('users', fileName);

  //   return file
  //     ? res
  //         .status(200)
  //         .contentType(file.contentType)
  //         .set('Cross-Origin-Resource-Policy', 'cross-origin')
  //         .send(file.buffer)
  //     : res.status(404).send();
  // }
}
