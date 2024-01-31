import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import {
  CurrencyCode,
  currenciesCodeArrays,
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
  userId: string;
}

export class CreateOneContributionDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(currenciesCodeArrays)
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

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  amount: number;
}

export class CreateOneContributionDonationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(currenciesCodeArrays)
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
