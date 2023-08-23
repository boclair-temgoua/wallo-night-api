import {
  Controller,
  Post,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { CreateOrUpdateLikesDto } from './likes.dto';
import { JwtAuthGuard } from '../users/middleware';

import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  /** Create Like */
  @Post(`/:type/:likeableId`)
  @UseGuards(JwtAuthGuard)
  async createOneLike(
    @Res() res,
    @Req() req,
    @Param() params: CreateOrUpdateLikesDto,
  ) {
    const { user } = req;
    const { type, likeableId } = params;

    const like = await this.likesService.createOne({
      type,
      likeableId,
      userId: user?.id,
    });

    return reply({ res, results: { id: like?.id } });
  }

  /** Delete Like */
  @Delete(`/:type/:likeableId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneLike(
    @Res() res,
    @Req() req,
    @Param() params: CreateOrUpdateLikesDto,
  ) {
    const { user } = req;
    const { type, likeableId } = params;

    const findOneLike = await this.likesService.findOneBy({
      type,
      likeableId,
      userId: user?.id,
    });
    if (!findOneLike)
      throw new HttpException(
        `This like ${likeableId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.likesService.updateOne(
      { likeId: findOneLike?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: `like deleted successfully` });
  }
}
