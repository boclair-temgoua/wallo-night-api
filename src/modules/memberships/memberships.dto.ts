import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
  IsOptional,
  IsInt,
  IsPositive,
  MinLength,
  IsUUID,
  MinDate,
  IsIn,
} from 'class-validator';
import { CurrencyCode, currencyCodeArrays } from '../currencies/currencies.type';

export class CreateOrUpdateMembershipsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  pricePerMonthly?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  pricePerYearly?: number;
  

  // @IsNotEmpty()
  // @IsString()
  // @IsIn(currencyCodeArrays)
  // currency: CurrencyCode;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  messageWelcome: string;
}

export class GetOneMembershipDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  membershipId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;
}