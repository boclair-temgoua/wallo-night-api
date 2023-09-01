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

    const likes = await this.likesService.findAllBy({
      type,
      likeableId,
      userId: user?.id,
    });

    Promise.all([
      likes.map(async (like) => {
        await this.likesService.updateOne(
          { likeId: like?.id },
          { deletedAt: new Date() },
        );
      }),
    ]);
    
    return reply({ res, results: `like deleted successfully` });
  }
}
