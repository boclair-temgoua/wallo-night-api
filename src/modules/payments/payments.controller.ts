import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
  HttpException,
  UseGuards,
  Get,
  Query,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { PaymentsService } from './payments.service';
import {
  CodeVerifyPaymentsDto,
  CreateOnePaymentDto,
  SendCodeVerifyPaymentsDto,
} from './payments.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { PaginationType, addPagination } from '../../app/utils/pagination';
import { otpMessageSend, otpVerifySid } from '../integrations/twilio-otp';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Get all Payments */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async createOne(@Res() res, @Req() req, @Body() body: CreateOnePaymentDto) {
    const { user } = req;
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

    return reply({ res, results: 'payment created successfully' });
  }

  /** Delete payment */
  @Delete(`/:paymentId`)
  @UseGuards(JwtAuthGuard)
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
}
