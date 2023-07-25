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

  @IsOptional()
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
