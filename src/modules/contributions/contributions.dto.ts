import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
  IsPositive,
  IsInt,
  IsIn,
} from 'class-validator';
import {
  CurrencyCode,
  currencyCodeArrays,
} from '../currencies/currencies.type';
import {
  TransactionType,
  transactionTypeArrays,
} from '../transactions/transactions.type';

export class SearchContributionDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  campaignId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  giftId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;
}

export class CreateOneContributionDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(currencyCodeArrays)
  currency: CurrencyCode;

  @IsNotEmpty()
  @IsString()
  @IsIn(transactionTypeArrays)
  meanOfPayment: TransactionType;

  @IsOptional()
  infoPaymentMethod: any;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  campaignId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userSendId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  giftId: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  amount: number;
}

export class CreateOneContributionGiftDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  giftId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userSendId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(transactionTypeArrays)
  meanOfPayment: TransactionType;

  @IsOptional()
  infoPaymentMethod: any;
}

export class CreateOneContributionDonationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(currencyCodeArrays)
  currency: CurrencyCode;

  @IsNotEmpty()
  @IsString()
  @IsIn(transactionTypeArrays)
  meanOfPayment: TransactionType;

  @IsOptional()
  infoPaymentMethod: any;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  userSendId: string;
}
