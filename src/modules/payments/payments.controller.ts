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
import { PaginationType, addPagination } from '../../app/utils/pagination';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { reply } from '../../app/utils/reply';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { otpMessageSend, otpVerifySid } from '../integrations/twilio-otp';
import { UserAuthGuard } from '../users/middleware';
import {
  CodeVerifyPaymentsDto,
  CreateOnePaymentDto,
  SendCodeVerifyPaymentsDto,
} from './payments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Get all Payments */
  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const payments = await this.paymentsService.findAll({
      search,
      pagination,
      organizationId: user.organizationId,
    });

    return reply({ res, results: payments });
  }

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
        cardNumber,
        organizationId: user?.organizationId,
      });
      if (findOnePayment)
        throw new HttpException(
          `Card ${cardNumber} already exists please change`,
          HttpStatus.NOT_FOUND,
        );

      await this.paymentsService.stripeTokenCreate({
        name: fullName,
        email,
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cardCvc,
      });

      await this.paymentsService.createOne({
        email,
        fullName,
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cardCvc,
        type,
        action: 'PAYMENT',
        description,
        userId: user?.id,
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

    if (type === 'PAYPAL') {
      const { setupIntent } =
        await this.paymentsService.stripeConfirmPayPalSetup({
          email: 'temgoua@gmail.com',
          description: 'my subscribe',
        });
      responseIntent = setupIntent;
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
