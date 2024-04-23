import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    Res,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { CommentsService } from '../comments/comments.service';
import { OrdersUtil } from '../orders/orders.util';
import { ProductsService } from '../products/products.service';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsUtil } from '../transactions/transactions.util';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import {
    CreateClientSecretStripeDto,
    CreateSubscribePaymentsDto,
} from './payments.dto';
import { PaymentsUtil, stripePrivate } from './payments.util';

@Controller('payments')
export class PaymentsTransactionController {
    constructor(
        private readonly paymentsUtil: PaymentsUtil,
        private readonly productsService: ProductsService,
        private readonly walletsService: WalletsService,
        private readonly transactionsUtil: TransactionsUtil,
        private readonly usersService: UsersService,
        private readonly commentsService: CommentsService,
        private readonly ordersUtil: OrdersUtil,
        private readonly transactionsService: TransactionsService
    ) {}

    /** Get subscribe */
    @Get(`/stripe/client-secret`)
    async createOneClientSecretStripe(
        @Res() res,
        @Query() query: CreateClientSecretStripeDto
    ) {
        const { amount, currency, reference } = query;
        const { value: amountValueConvert } =
            await this.transactionsUtil.convertedValue({
                currency: currency,
                value: amount,
            });

        const paymentIntent = await stripePrivate.paymentIntents.create({
            amount: amountValueConvert * 100,
            currency: 'USD',
            metadata: { reference },
        });
        if (!paymentIntent.client_secret) {
            throw new HttpException(
                `Stripe failed to create payment intent`,
                HttpStatus.NOT_FOUND
            );
        }

        return reply({ res, results: paymentIntent });
    }

    /** Create Shop */
    @Post(`/paypal/shop`)
    async createOnePaypalShop(
        @Res() res,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            amount,
            organizationSellerId,
            userReceiveId,
            userBuyerId,
            reference,
            cartOrderId,
            userAddress,
        } = body;
        const findOneUser = await this.usersService.findOneBy({
            userId: userBuyerId,
        });
        if (!findOneUser) {
            throw new HttpException(
                `This user ${userBuyerId} dons't exist please change`,
                HttpStatus.NOT_FOUND
            );
        }

        const { value: amountValueConvert } =
            await this.transactionsUtil.convertedValue({
                currency: amount?.currency,
                value: amount?.value,
            });

        const { order } = await this.ordersUtil.orderShopCreate({
            organizationBuyerId: findOneUser?.organizationId,
            userBuyerId: userBuyerId,
            cartOrderId,
            organizationSellerId,
            userAddress,
        });

        const transaction = await this.transactionsService.createOne({
            userBuyerId: findOneUser?.id,
            userReceiveId: userReceiveId,
            amount: amount?.value * 100,
            currency: amount?.currency.toUpperCase(),
            organizationId: organizationSellerId,
            orderId: order?.id,
            type: 'PAYPAL',
            token: reference,
            model: 'PRODUCT',
            email: findOneUser?.email,
            description: `Product shop userId: ${findOneUser?.id}`,
            amountConvert: amountValueConvert * 100,
        });

        if (transaction?.token) {
            await this.walletsService.incrementOne({
                amount: transaction?.amountConvert,
                organizationId: transaction?.organizationId,
            });
        }

        return reply({ res, results: reference });
    }

    /** Create Shop */
    @Post(`/stripe/shop`)
    async createOneStripeShop(
        @Res() res,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            amount,
            organizationSellerId,
            userReceiveId,
            userBuyerId,
            reference,
            cartOrderId,
            card,
            userAddress,
        } = body;
        const findOneUser = await this.usersService.findOneBy({
            userId: userBuyerId,
        });
        if (!findOneUser) {
            throw new HttpException(
                `This user ${userBuyerId} dons't exist please change`,
                HttpStatus.NOT_FOUND
            );
        }
        const { value: amountValueConvert } =
            await this.transactionsUtil.convertedValue({
                currency: amount?.currency,
                value: amount?.value,
            });

        const { paymentIntents } = await this.paymentsUtil.stripeMethod({
            card,
            currency: amount?.currency.toUpperCase(),
            amountDetail: amount,
            token: reference,
            userBuyerId,
            organizationBuyerId: findOneUser?.organizationId,
            description: `Product shop userId: ${findOneUser?.id}`,
        });
        if (!paymentIntents) {
            throw new HttpException(
                `Transaction not found please try again`,
                HttpStatus.NOT_FOUND
            );
        }

        if (paymentIntents) {
            const { order } = await this.ordersUtil.orderShopCreate({
                organizationBuyerId: findOneUser?.organizationId,
                userBuyerId: userBuyerId,
                cartOrderId,
                organizationSellerId,
                userAddress,
            });
            const transaction = await this.transactionsService.createOne({
                userBuyerId: findOneUser?.id,
                userReceiveId: userReceiveId,
                amount: Number(paymentIntents?.amount_received),
                currency: paymentIntents?.currency.toUpperCase(),
                organizationId: organizationSellerId,
                orderId: order?.id,
                type: 'CARD',
                token: reference,
                model: 'PRODUCT',
                email: findOneUser?.email,
                fullName: `${findOneUser?.profile?.firstName} ${findOneUser?.profile?.lastName}`,
                description: `Product shop userId: ${findOneUser?.id}`,
                amountConvert: amountValueConvert * 100,
            });

            if (transaction?.token) {
                await this.walletsService.incrementOne({
                    amount: transaction?.amountConvert,
                    organizationId: transaction?.organizationId,
                });
            }
        }

        return reply({ res, results: reference });
    }

    /** Create Event */
    @Post(`/stripe/event`)
    async createOneEvent(@Res() res, @Body() body: CreateSubscribePaymentsDto) {
        const {
            amount,
            organizationSellerId,
            organizationBuyerId,
            userAddress,
            productId,
            userReceiveId,
            userBuyerId,
            reference,
            card,
        } = body;

        const findOneProduct = await this.productsService.findOneBy({
            productId: productId,
            organizationId: organizationSellerId,
        });
        if (!findOneProduct) {
            throw new HttpException(
                `This product ${productId} dons't exist please change`,
                HttpStatus.NOT_FOUND
            );
        }

        const { value: amountValueConvert } =
            await this.transactionsUtil.convertedValue({
                currency: amount?.currency,
                value: amount?.value,
            });

        const { paymentIntents } = await this.paymentsUtil.stripeMethod({
            card,
            currency: amount?.currency.toUpperCase(),
            amountDetail: amount,
            token: reference,
            userBuyerId,
            organizationBuyerId,
            description: `Event ${findOneProduct?.title}`,
        });
        if (!paymentIntents) {
            throw new HttpException(
                `Transaction not found please try again`,
                HttpStatus.NOT_FOUND
            );
        }

        if (paymentIntents) {
            const { order } =
                await this.ordersUtil.orderEventOrMembershipCreate({
                    amount,
                    userAddress,
                    model: 'EVENT',
                    organizationBuyerId,
                    organizationSellerId,
                    userBuyerId: userBuyerId,
                    productId: findOneProduct?.id,
                });
            const transaction = await this.transactionsService.createOne({
                userBuyerId,
                userReceiveId: userReceiveId,
                amount: Number(paymentIntents?.amount_received),
                currency: paymentIntents?.currency?.toUpperCase(),
                organizationId: organizationSellerId,
                orderId: order?.id,
                type: 'CARD',
                token: reference,
                model: 'EVENT',
                description: paymentIntents?.description,
                amountConvert: amountValueConvert * 100,
            });

            if (transaction?.token) {
                await this.walletsService.incrementOne({
                    amount: transaction?.amountConvert,
                    organizationId: transaction?.organizationId,
                });
            }
        }

        // send email to buyer
        // await orderCommissionJob({ email: findOneUser?.email, token: '' });

        return reply({ res, results: reference });
    }

    @Post(`/paypal/event`)
    async createOnePayPalEvent(
        @Res() res,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            amount,
            organizationSellerId,
            organizationBuyerId,
            userAddress,
            productId,
            userReceiveId,
            userBuyerId,
            reference,
        } = body;
        const findOneProduct = await this.productsService.findOneBy({
            productId: productId,
            organizationId: organizationSellerId,
        });
        if (!findOneProduct) {
            throw new HttpException(
                `This product ${productId} dons't exist please change`,
                HttpStatus.NOT_FOUND
            );
        }

        const { value: amountValueConvert } =
            await this.transactionsUtil.convertedValue({
                currency: amount?.currency,
                value: amount?.value,
            });

        const { order } = await this.ordersUtil.orderEventOrMembershipCreate({
            amount,
            userAddress,
            model: 'EVENT',
            organizationBuyerId,
            organizationSellerId,
            userBuyerId: userBuyerId,
            productId: findOneProduct?.id,
        });

        const transaction = await this.transactionsService.createOne({
            userBuyerId,
            userReceiveId,
            currency: amount?.currency.toUpperCase(),
            amount: Number(amount?.value) * 100,
            organizationId: organizationSellerId,
            orderId: order?.id,
            type: 'PAYPAL',
            token: reference,
            model: 'EVENT',
            description: `Event ${findOneProduct?.title}`,
            amountConvert: amountValueConvert * 100,
        });

        if (transaction?.token) {
            await this.walletsService.incrementOne({
                amount: transaction?.amountConvert,
                organizationId: transaction?.organizationId,
            });
        }

        return reply({ res, results: reference });
    }
}
