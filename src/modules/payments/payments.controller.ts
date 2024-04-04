import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { reply } from '../../app/utils/reply';
import { SearchQueryDto } from '../../app/utils/search-query';
import { otpVerifySid } from '../integrations/twilio-otp';
import { UserAuthGuard } from '../users/middleware';
import { CreateOnePaymentDto, GetPaymentsDto } from './payments.dto';
import { PaymentsService } from './payments.service';
import { PaymentsUtil } from './payments.util';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsUtil: PaymentsUtil,
    private readonly paymentsService: PaymentsService,
  ) {}

  /** Get all Payments */
  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() query: GetPaymentsDto,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { type } = query;
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const payments = await this.paymentsService.findAll({
      type,
      search,
      pagination,
      organizationId: user.organizationId,
    });

    return reply({ res, results: payments });
  }

  // /** Get one Payment */
  // @Get(`/one-payment`)
  // @UseGuards(UserAuthGuard)
  // async getOne(
  //   @Res() res,
  //   @Req() req,
  // ) {
  //   const { user } = req;

  //   const payment = await this.paymentsService.findOneBy({
  //     organizationId: user.organizationId,
  //     pagination,
  //     organizationId: user.organizationId,
  //   });

  //   return reply({ res, results: payment });
  // }

  /** Create one payment */
  @Post(`/create`)
  @UseGuards(UserAuthGuard)
  async createOne(@Res() res, @Req() req, @Body() body: CreateOnePaymentDto) {
    const { user } = req;
    let responseIntent = {};
    const {
      email,
      phone,
      fullName,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      type,
      iban,
      code,
    } = body;

    if (type === 'CARD') {
      const findOnePayment = await this.paymentsService.findOneBy({
        cardCvc,
        cardNumber,
        cardExpYear,
        cardExpMonth,
        status: 'ACTIVE',
        organizationId: user?.organizationId,
      });
      if (findOnePayment)
        throw new HttpException(
          `Card ${cardNumber} already exists please change`,
          HttpStatus.NOT_FOUND,
        );

      const { paymentMethod } = await this.paymentsUtil.stripeTokenCheck({
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cardCvc,
        email,
        name: fullName,
      });

      await this.paymentsService.createOne({
        email,
        fullName,
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cardCvc,
        type: 'CARD',
        action: 'PAYMENT',
        status: 'ACTIVE',
        userId: user?.id,
        brand: paymentMethod?.card?.display_brand,
        organizationId: user?.organizationId,
      });
    }

    if (type === 'IBAN') {
      const findOnePayment = await this.paymentsService.findOneBy({
        iban,
        status: 'ACTIVE',
        organizationId: user?.organizationId,
      });
      if (findOnePayment)
        throw new HttpException(
          `Card ${iban} already exists please change`,
          HttpStatus.NOT_FOUND,
        );

      await this.paymentsService.createOne({
        iban,
        email,
        fullName,
        type: 'IBAN',
        action: 'WITHDRAWING',
        status: 'ACTIVE',
        userId: user?.id,
        organizationId: user?.organizationId,
      });
    }

    if (type === 'PHONE' && code) {
      const findOnePayment = await this.paymentsService.findOneBy({
        phone,
        organizationId: user?.organizationId,
      });
      if (findOnePayment)
        throw new HttpException(
          `Phone ${phone} already exists please change`,
          HttpStatus.NOT_FOUND,
        );

      const otpMessageVerifySid = await otpVerifySid({
        phone: phone,
        code: code,
      });
      if (!otpMessageVerifySid?.valid) {
        throw new HttpException(`OTP verify invalid`, HttpStatus.NOT_FOUND);
      }

      await this.paymentsService.createOne({
        phone,
        fullName,
        type,
        action: 'WITHDRAWING',
        userId: user?.id,
        status: 'ACTIVE',
        organizationId: user?.organizationId,
      });
    }

    return reply({ res, results: responseIntent });
  }

  /** Delete payment */
  @Delete(`/:paymentId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
  ) {
    await this.paymentsService.updateOne(
      { paymentId: paymentId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'payment deleted successfully' });
  }

  // /** Delete payment */
  // @Post(`/confirm-paypal-setup`)
  // @UseGuards(UserAuthGuard)
  // async confirmPayPalSetup(@Res() res, @Req() req) {
  //   const { setupIntent } = await this.paymentsService.stripeConfirmPayPalSetup(
  //     {
  //       email: 'temgoua@gmail.com',
  //       description: 'my subscribe',
  //     },
  //   );

  //   return reply({ res, results: setupIntent });
  // }
}
