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
import { PaymentsService } from './payments.service';
import { SubscribesService } from '../subscribes/subscribes.service';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { generateLongUUID } from '../../app/utils/commons';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly subscribesUtil: SubscribesUtil,
  ) {}

  /** Create Like */
  @Post(`/paypal/subscribe`)
  @UseGuards(JwtAuthGuard)
  async createOnePaypalSubscribe(@Res() res, @Req() req, @Body() body) {
    const { amount, currency, membershipId, userId, paymentMethod } = body;
    const { user } = req;
    console.log('body ===>', body);
    // const { type, likeableId } = params;

    console.log('body ===>', body);
    const newToken = generateLongUUID(30);
    await this.subscribesUtil.createOrUpdateOneSubscribe({
      userId,
      amount: { ...amount },
      membershipId,
      type: 'PAYPAL',
      token: newToken,
    });

    return reply({ res, results: { toke: newToken } });
  }
}
