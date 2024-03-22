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
  PaginationType,
  RequestPaginationDto,
  addPagination,
} from '../../app/utils/pagination';
import { reply } from '../../app/utils/reply';
import { SearchQueryDto } from '../../app/utils/search-query';
import { otpMessageSend, otpVerifySid } from '../integrations/twilio-otp';
import { UserAuthGuard } from '../users/middleware';
import {
  CodeVerifyPaymentsDto,
  CreateOnePaymentDto,
  GetPaymentsDto,
  SendCodeVerifyPaymentsDto,
} from './payments.dto';
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
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { type } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
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

  /** resend code one payment */
  @Post(`/resend-code-verify-phone`)
  @UseGuards(UserAuthGuard)
  async sendCodeVerifyPhoneOne(
    @Res() res,
    @Req() req,
    @Body() body: SendCodeVerifyPaymentsDto,
  ) {
    const { phone } = body;

    const otpMessageVoce = await otpMessageSend({ phone });
    if (!otpMessageVoce) {
      throw new HttpException(
        `OTP messageVoce not valid`,
        HttpStatus.NOT_FOUND,
      );
    }

    return reply({ res, results: 'OTP send successfully' });
  }

  /** Verify one payment */
  @Post(`/code-verify-phone`)
  @UseGuards(UserAuthGuard)
  async codeVerifyPhoneOne(
    @Res() res,
    @Req() req,
    @Body() body: CodeVerifyPaymentsDto,
  ) {
    const { user } = req;
    const { phone, code } = body;

    const findOnePayment = await this.paymentsService.findOneBy({
      phone,
      organizationId: user?.organizationId,
    });
    if (!findOnePayment)
      throw new HttpException(
        `Phone ${phone} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const otpMessageVerifySid = await otpVerifySid({
      phone: findOnePayment?.phone,
      code: code,
    });
    if (!otpMessageVerifySid?.valid) {
      throw new HttpException(`OTP verify not valid`, HttpStatus.NOT_FOUND);
    }

    await this.paymentsService.updateOne(
      { paymentId: findOnePayment?.id },
      {
        status: 'ACTIVE',
      },
    );

    return reply({ res, results: 'OTP verified successfully' });
  }

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
      description,
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

    if (type === 'PHONE') {
      const findOnePayment = await this.paymentsService.findOneBy({
        phone,
        organizationId: user?.organizationId,
      });
      if (findOnePayment)
        throw new HttpException(
          `Phone ${phone} already exists please change`,
          HttpStatus.NOT_FOUND,
        );

      await this.paymentsService.createOne({
        phone,
        fullName,
        type,
        action: 'WITHDRAWING',
        userId: user?.id,
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
