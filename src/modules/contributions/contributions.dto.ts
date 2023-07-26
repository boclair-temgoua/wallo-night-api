import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
  IsPositive,
  IsInt,
  IsEnum,
} from 'class-validator';
import { CurrencyCode } from '../currencies/currencies.type';
import { TransactionType } from '../transactions/transactions.type';

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
  @IsEnum(CurrencyCode)
  currency: CurrencyCode;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsNotEmpty()
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
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsNotEmpty()
  infoPaymentMethod: any;
}

export class CreateOneContributionDonationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(CurrencyCode)
  currency: CurrencyCode;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsNotEmpty()
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
