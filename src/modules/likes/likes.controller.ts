import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { UserAuthGuard } from '../users/middleware';
import { CreateOrUpdateLikesDto } from './likes.dto';

import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  /** Create Like */
  @Post(`/:type/:likeableId`)
  @UseGuards(UserAuthGuard)
  async createOneLike(
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

    if (!findOneLike) {
      await this.likesService.createOne({
        type,
        likeableId,
        userId: user?.id,
      });
    }
    return reply({ res, results: 'Like save successfully' });
  }

  /** Delete Like */
  @Delete(`/:type/:likeableId`)
  @UseGuards(UserAuthGuard)
  async deleteOneLike(
    @Res() res,
    @Req() req,
    @Param() params: CreateOrUpdateLikesDto,
  ) {
    const { user } = req;
    const { type, likeableId } = params;

    const likes = await this.likesService.findAllBy({
      type,
      likeableId,
      userId: user?.id,
    });

    for (const like of likes) {
      await this.likesService.updateOne(
        { likeId: like?.id },
        { deletedAt: new Date() },
      );
    }

    return reply({ res, results: `like deleted successfully` });
  }
}
