import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  Max,
  Min,
  IsPositive,
  IsInt,
  IsIn,
} from 'class-validator';
import { AmountModel } from '../wallets/wallets.type';
import {
  TransactionType,
  transactionTypeArrays,
} from '../transactions/transactions.type';

export type StatusPayment = 'ACTIVE' | 'PENDING' | 'INVALID';

export const statusPaymentArray = ['ACTIVE', 'PENDING', 'INVALID'];

export class CreateOnePaymentDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(transactionTypeArrays)
  type: TransactionType;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  cardName: string;

  @IsOptional()
  @IsString()
  cardNumber: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(12)
  cardExpMonth: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(2020)
  cardExpYear: number;

  @IsOptional()
  @IsString()
  cardCvc: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class CreateSubscribePaymentsDto {
  @IsOptional()
  @IsString()
  membershipId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userReceiveId: string;

  @IsOptional()
  @IsString()
  userSendId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  reference: string;

  @IsOptional()
  paymentMethod: any;

  @IsOptional()
  amount: AmountModel;
}
